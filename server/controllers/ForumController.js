const Forum = require("../models/Forum");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./storage");

const token = localStorage.getItem("AUTH_TOKEN");
console.log("local token", token);

exports.getForumPage = async (req, res) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.userId;
  const posts = await Forum.find();
  const postsWithComments = await Promise.all(
    posts.map(async (post) => {
      const commentsCount = await Comment.countDocuments({ postId: post._id });
      return {
        ...post.toObject(),
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
};

exports.postForumPost = async (req, res) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.userId;
  const { title, content } = req.body;
  const newPost = new Forum({
    userId: userId,
    title: title,
    content: content,
    createdAt: new Date(),
  });
  try {
    await Forum.create(newPost);
    const posts = await Forum.find();
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          postId: post._id,
        });
        return {
          ...post.toObject(),
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
    console.log(error);
  }
};

exports.postComment = async (req, res) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.userId;
  const { postId, comment } = req.body;
  console.log(req.body);
  const newComment = new Comment({
    userId: userId,
    postId: postId,
    comment: comment,
    createdAt: new Date(),
  });
  try {
    await Comment.create(newComment);
    const posts = await Forum.find();
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          postId: post._id,
        });
        return {
          ...post.toObject(),
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
    console.log(error);
  }
};

exports.getPostComments = async (req, res) => {
  const postID = req.query.postId;
  const comments = await Comment.find({ postId: postID });
  res.json(comments);
};
