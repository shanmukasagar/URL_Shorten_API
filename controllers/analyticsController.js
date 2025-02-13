const { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics   } = require("../services/analyticsService");

// Get URL Analytics API
async function fetchUrlAnalytics(req, res) {
    try {
        const alias = req.params.alias;
        const analytics = await getUrlAnalytics(alias);

        if (analytics.error) {
            return res.status(404).json({ error: "No analytics data found for this shortAlias" });
        }

        res.status(200).json(analytics);
    } 
    catch (error) {
        console.error("Analytics fetch error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Controller to fetch topic-based analytics
async function getTopicAnalyticsController(req, res) {
    try {
        const { topic } = req.params;
        if (!topic) {
            return res.status(400).json({ error: "Topic parameter is required" });
        }
        const analyticsData = await getTopicAnalytics(topic);
        if(analyticsData.error) {
            return res.status(400).json(analyticsData.error);
        }
        return res.status(200).json(analyticsData);
    } 
    catch (error) {
        console.error("Error fetching topic analytics:", error);
        return res.status(500).json("Internal Server Error");
    }
}

// Get overall analytics
async function getOverallAnalyticsController(req, res) {
    try {
        const userId = req.user.email; // Assuming user authentication middleware sets `req.user`
        const analytics = await getOverallAnalytics(userId);
        res.status(200).json(analytics);
    } catch (error) {
        console.error("Error fetching overall analytics:", error);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = { fetchUrlAnalytics, getTopicAnalyticsController, getOverallAnalyticsController};
