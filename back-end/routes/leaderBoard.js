const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderBoard");


router.get("/getLeaderboardPage", leaderboardController.getLeaderboardPage);
// router.get("/getLeaderboard", leaderboardController.getLeaderboard);

module.exports = router;