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
        const user = await User.findById(post.userId);
        return {
          ...post.toObject(),
          username: user.username,
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
    const token = localStorage.getItem("AUTH_TOKEN");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const { title, content, username } = req.body;

    const newPost = new Forum({
      userId: userId,
      username: username,
      title: title,
      content: content,
      createdAt: new Date(),
    });

    await Forum.create(newPost);

    const posts = await Forum.find();
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          postId: post._id,
        });
        const user = await User.findById(post.userId);
        return {
          ...post.toObject(),
          username: user.username,
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

    res.render("forum", info);
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
