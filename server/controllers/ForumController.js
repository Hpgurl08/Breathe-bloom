const Forum = require("../models/Forum");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./storage");
const User = require("../models/User");

exports.getForumPage = async (req, res) => {
  try {
    const token = localStorage.getItem("AUTH_TOKEN");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const posts = await Forum.find();
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          postId: post._id,
        });
        const user = await User.findById(userId); // Find the user by userId
        const username = user ? user.username : "Unknown"; // Default to "Unknown" if user is not found
        return {
          ...post.toObject(),
          username: username,
          commentsCount: commentsCount,
        };
      })
    );

    const info = {
      title: "Community Forum",
      description: "Community content",
      token: decodedToken,
      posts: postsWithComments,
    };

    res.render("forum", info);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

exports.postForumPost = async (req, res) => {
  try {
    const { username, title, content } = req.body;
    const token = localStorage.getItem("AUTH_TOKEN");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Check if the userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId");
      return res.status(400).send("Invalid userId");
    }

    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return res.status(404).send("User not found");
    }

    const newPost = new Forum({
      userId: userId,
      username: user.username,
      title: title,
      content: content,
      createdAt: new Date(),
    });

    await newPost.save();

    // Fetch all posts with comments after adding the new post
    const posts = await Forum.find();
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          postId: post._id,
        });
        const postUser = await User.findById(post.userId);
        return {
          ...post.toObject(),
          username: postUser ? postUser.username : "Unknown",
          commentsCount: commentsCount,
        };
      })
    );

    const info = {
      title: "Forum",
      description: "Forum content",
      token: decodedToken,
      posts: postsWithComments,
    };

    res.render("forum", info); // Render the forum page with updated posts
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

exports.postComment = async (req, res) => {
  try {
    const token = localStorage.getItem("AUTH_TOKEN");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const { postId, comment } = req.body;

    // Find the user to get the username
    const user = await User.findById(userId);

    const newComment = new Comment({
      userId: userId,
      postId: postId,
      username: user.username, // Save the username along with the comment
      comment: comment,
      createdAt: new Date(),
    });

    await newComment.save();

    // Redirect back to the forum page
    res.redirect("/forum");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const postID = req.query.postId;
    const comments = await Comment.find({ postId: postID });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
