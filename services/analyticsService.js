const moment = require("moment");
const {connectDB, getDB} = require("../config/db");


async function getUrlAnalytics(alias) { // Fetch URL Analytics
    try {
        await connectDB();
        const db = getDB();
        const analyticsCollection = db.collection("UrlAnalytics");

        // Total Clicks
        const totalClicks = await analyticsCollection.countDocuments({ shortUrl: alias });

        if(!totalClicks) {
            return {error : "Given alias is not valid"};
        }

        // Unique Users based on userId
        const uniqueUsers = await analyticsCollection.distinct("userId", { shortUrl: alias });

        // Clicks by Date (last 7 days)
        const last7Days = Array.from({ length: 7 }).map((_, i) =>
            moment().subtract(i, "days").format("YYYY-MM-DD")
        );
        
        const clicksByDate = await analyticsCollection.aggregate([
            { $match: { shortUrl: alias, date: { $in: last7Days } } },
            { $group: { _id: "$date", clickCount: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();

        // OS Type Breakdown
        const osType = await analyticsCollection.aggregate([
            { $match: { shortUrl: alias } },
            { $group: { _id: "$os", uniqueClicks: { $sum: 1 }, uniqueUsers: { $addToSet: "$userId" } } },
            { $project: { osName: "$_id", uniqueClicks: 1, uniqueUsers: { $size: "$uniqueUsers" }, _id: 0 } }
        ]).toArray();

        // Device Type Breakdown
        const deviceType = await analyticsCollection.aggregate([
            { $match: { shortUrl: alias } },
            { $group: { _id: "$device", uniqueClicks: { $sum: 1 }, uniqueUsers: { $addToSet: "$userId" } } },
            { $project: { deviceName: "$_id", uniqueClicks: 1, uniqueUsers: { $size: "$uniqueUsers" }, _id: 0 } }
        ]).toArray();

        return {
            totalClicks,
            uniqueUsers: uniqueUsers.length,
            clicksByDate,
            osType,
            deviceType
        };

    } catch (error) {
        console.error("Error fetching analytics:", error);
        throw error;
    }
}

// Service function to get topic-based analytics
async function getTopicAnalytics(topic) {
    await connectDB();
    const db = getDB();
    const urlCollection = db.collection("Urls");
    const analyticsCollection = db.collection("UrlAnalytics");

    // Fetch all short URLs for the given topic
    const urls = await urlCollection.find({ topic }).toArray();

    if (!urls.length) {
        return { error: "No URLs found for this topic." };
    }

    const shortUrls = urls.map(url => url.shortUrl);

    // Fetch analytics data for the short URLs
    const analyticsData = await analyticsCollection.find({ shortUrl: { $in: shortUrls } }).toArray();

    // Aggregate total clicks and unique users (based on userId)
    const totalClicks = analyticsData.length;
    const uniqueUsers = new Set(analyticsData.map(entry => entry.userId)).size;

    // Compute clicks by date (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const clicksByDate = await analyticsCollection.aggregate([
        { $match: { shortUrl: { $in: shortUrls }, timestamp: { $gte: last7Days } } },
        { $group: { _id: "$date", clickCount: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]).toArray();

    // Compute analytics for each short URL
    const urlAnalytics = shortUrls.map(shortUrl => {
        const urlClicks = analyticsData.filter(entry => entry.shortUrl === shortUrl);
        const uniqueUsersCount = new Set(urlClicks.map(entry => entry.userId)).size;

        return {
            shortUrl: `http://short.ly/${shortUrl}`,
            totalClicks: urlClicks.length,
            uniqueUsers: uniqueUsersCount
        };
    });

    return {
        topic,
        totalClicks,
        uniqueUsers,
        clicksByDate,
        urls: urlAnalytics
    };
}

// Get overall analytics
async function getOverallAnalytics(userId) {
    await connectDB();
    const db = getDB();
    const urlCollection = db.collection("Urls");
    const analyticsCollection = db.collection("UrlAnalytics");

    // Fetch all URLs created by the user
    const userUrls = await urlCollection.find({ userId }).toArray();
    const shortUrls = userUrls.map(url => url.shortUrl);

    if (shortUrls.length === 0) {
        return {
            totalUrls: 0,
            totalClicks: 0,
            uniqueUsers: 0,
            clicksByDate: [],
            osType: [],
            deviceType: []
        };
    }

    // Get total clicks and unique users (based on userId)
    const totalClicks = await analyticsCollection.countDocuments({ shortUrl: { $in: shortUrls } });
    const uniqueUsers = await analyticsCollection.distinct("userId", { shortUrl: { $in: shortUrls } });

    // Clicks grouped by date (recent 7 days)
    const clicksByDate = await analyticsCollection.aggregate([
        { $match: { shortUrl: { $in: shortUrls } } },
        { $group: { _id: "$date", totalClicks: { $sum: 1 } } },
        { $sort: { _id: -1 } },
        { $limit: 7 }
    ]).toArray();

    // OS-based analytics
    const osType = await analyticsCollection.aggregate([
        { $match: { shortUrl: { $in: shortUrls } } },
        { $group: { _id: "$os", uniqueClicks: { $sum: 1 }, uniqueUsers: { $addToSet: "$userId" } } }
    ]).toArray();
    osType.forEach(os => os.uniqueUsers = os.uniqueUsers.length);

    // Device-based analytics
    const deviceType = await analyticsCollection.aggregate([
        { $match: { shortUrl: { $in: shortUrls } } },
        { $group: { _id: "$device", uniqueClicks: { $sum: 1 }, uniqueUsers: { $addToSet: "$userId" } } }
    ]).toArray();
    deviceType.forEach(device => device.uniqueUsers = device.uniqueUsers.length);

    return {
        totalUrls: shortUrls.length,
        totalClicks,
        uniqueUsers: uniqueUsers.length,
        clicksByDate,
        osType: osType.map(os => ({ osName: os._id, uniqueClicks: os.uniqueClicks, uniqueUsers: os.uniqueUsers })),
        deviceType: deviceType.map(device => ({ deviceName: device._id, uniqueClicks: device.uniqueClicks, uniqueUsers: device.uniqueUsers }))
    };
}

module.exports = { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics};