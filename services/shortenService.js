const {connectDB, getDB} = require("../config/db");
const redisClient = require("../config/redis");
const shortid = require("shortid");
const geoip = require("geoip-lite"); // To get geolocation from IP
const moment = require("moment");
const uaParser = require("ua-parser-js");

// Create Short URL
async function shortenUrl(urlData) {
    try{
        await connectDB();
        const db = getDB();
        const urlCollection = await db.collection('Urls');

        // If alias is provided, check if it's unique
        if (urlData.customAlias) {
            const existing = await urlCollection.findOne({ shortUrl: urlData.customAlias });
            if (existing) {
                return { error: "Custom alias already taken!" };
            }
        }

        if(urlData.customAlias && urlData.customAlias === "") {
            return { error: "Custom alias is not empty" };
        }

        const shortUrl = urlData.customAlias  || shortid.generate(); // Generate unique short URL
        const newUrl = { 
            longUrl : urlData.longUrl, 
            shortUrl : shortUrl, 
            topic : urlData.topic || "", 
            createdAt: new Date(),
            userId : urlData.userId
        };

        const result = await urlCollection.insertOne(newUrl); // Save to MongoDB
        if(result) {
            if (redisClient.isOpen) {
                await redisClient.setEx(shortUrl, 3600, urlData.longUrl); // Cache for 1 hour
            } 
            else {
                console.error("Redis client is not connected");
            }
        }

        return { shortUrl: `http://short.ly/${shortUrl}`, createdAt: newUrl.createdAt };

    }
    catch(error) {
        console.error("Error in shortenUrl:", error.message);
        throw error;
    }
}

//Return longURL taken from redis or mongodb
async function longURL(alias, ip, userAgent, userId) {
    try{
        
        let longUrl = await redisClient.get(alias); // Check Redis first for the short URL
        await connectDB();
        const db = getDB();

        if (!longUrl) { // If not found in Redis, check MongoDB

            const urlCollection = await db.collection('Urls');
            const urlDoc = await urlCollection.findOne({ shortUrl: alias });

            if (urlDoc) {
                longUrl = urlDoc.longUrl;
                // Cache the long URL in Redis for future lookups
                await redisClient.setEx(alias, 3600, longUrl); // Cache for 1 hour
            } else {
                return { error: "Short URL not found" };
            }
        }
        const geo = geoip.lookup(ip);

        // Parse User-Agent for OS and Device Type
        const ua = uaParser(userAgent);
        const osType = ua.os.name || "Windows";
        const deviceType = ua.device.type || "Desktop"; // Default to desktop if unknown

        const analyticsData = {
            shortUrl: alias,
            os: osType,
            device: deviceType,
            ip,
            userAgent,
            geolocation: geo ? geo.country : "Unknown",
            date: moment().format("YYYY-MM-DD"),
            timestamp: new Date(),
            userId : userId
        };

        const analyticsCollection = db.collection("UrlAnalytics");
        const result = await analyticsCollection.insertOne(analyticsData);
        if(result.acknowledged) {
            return longUrl;
        }
        return { error : "Error occured while inserting url analytics"};
    }
    catch(error) {
        console.error("Error in redirectUrl:", error.message);
        throw error;
    }
}

module.exports = { shortenUrl, longURL};
