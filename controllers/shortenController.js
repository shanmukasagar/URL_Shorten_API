const { shortenUrl, longURL } = require("../services/shortenService");

// Create Short URL
async function createShortUrl(req, res) {
    const urlData = req.body;
    try{
        if (!urlData.longUrl) {
            return res.status(400).json({ error: "longUrl is required!" });
        }
        if(req.user.email) {
            urlData.userId = req.user.email;
        }
        const result = await shortenUrl(urlData);
        if (result.error) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    }
    catch(error) {
        return res.status(500).json({error: "Internal Server Error" });
    }
}
//Redirect long URL
async function redirectLongUrl(req, res) {
    const alias = req.params.alias;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    if(!req.user.email) {
        res.status(400).json("Unauthorized ");
    }

    const userId = req.user.email;
    try {
        const result = await longURL(alias, ip, userAgent, userId);
        if(result.error) {
            return res.status(400).json(result.error);
        }
        return res.redirect(result);
    } 
    catch (error) {
        console.error("Error during redirect:", error);
        return res.status(500).json("Internal server Error");
    }
}

module.exports = { createShortUrl, redirectLongUrl };
