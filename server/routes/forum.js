const express = require("express");
const router = express.Router();
const forumControler = require("../controllers/ForumController");

router.get("/forum", forumControler.getForumPage);
router.post("/forum", forumControler.postForumPost);

router.get("/comments", forumControler.getPostComments);
router.post("/comments", forumControler.postComment);

module.exports = router;
