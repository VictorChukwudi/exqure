require("dotenv").config();
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Blogger = require("../models/blog/blogUser");
const Post = require("../models/blog/blogPost");
const { fileUpload } = require("../util/functions");

const blogSignUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    //Checks for signup credentials
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const { fullname, email, password } = req.body;
      const blogger = await Blogger.findOne({ email });

      if (blogger) {
        res.status(400);
        throw Error("Account exists already. Signin please.");
      } else {
        const newBlogger = new Blogger({
          fullname,
          email,
          password,
        });
        //Password Hashing
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newBlogger.password, salt, (err, hash) => {
            if (err) {
              res.status(500);
              throw Error("Server Error");
            }
            newBlogger.password = hash;
            newBlogger.save();
            res.status(201).json({
              status: "Success",
              data: {
                fullname: newBlogger.fullname,
                email: newBlogger.email,
              },
            });
          });
        });
      }
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};

const blogSignIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    //Checks for signin credentials
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const { email, password } = req.body;
      const blogger = await Blogger.findOne({ email });

      if (blogger && (await bcrypt.compare(password, blogger.password))) {
        const token = jwt.sign(
          { id: blogger._id, email },
          process.env.BLOG_TOKEN_KEY,
          { expiresIn: "5h" }
        );
        res.status(200).json({
          status: "Success",
          msg: "Logged In",
          data: {
            userId: blogger._id,
            email: blogger.email,
            token,
          },
        });
      } else {
        res.status(400);
        throw Error("Invalid Login Credentials");
      }
    }
  } catch (error) {
    res.status(400).json({
      status: "Error",
      msg: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    //Checks for signin credentials
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const { title, body, category } = req.body;
      //for post images upload
      const images = req.files;
      const imagesUploader = await fileUpload(images);
      //creating new post
      const blogger = await Blogger.findById(req.user.id);
      const post = new Post({
        title,
        category: category.toLowerCase(),
        body,
        images: imagesUploader,
        author: blogger.fullname,
      });

      await post.save();
      //   res.status(201).json({
      //     status: "Success",
      //     msg: "Blog post created.",
      //     data: {
      //       title: post.title,
      //       category: post.category,
      //       body: post.body,
      //       images: post.images,
      //       author: post.author,
      //     },
      //   });
      res.status(301).redirect("/api/blog/posts");
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Success",
      msg: error.message,
    });
  }
};

const allPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .select(["-_id", "-__v", "-updatedAt"]);
    if (posts.length < 1) {
      res.status(200).json({
        status: "Success",
        msg: "No posts found",
      });
    } else {
      res.status(200).json({
        status: "Success",
        posts,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};
const searchCategories = async (req, res) => {
  try {
    const category = req.query.category.toLowerCase();
    if (!category) {
      res.status(200).json({
        status: "Success",
        posts: await Post.find().select(["-_id", "-__v", "-updatedAt"]),
      });
    } else {
      const posts = await Post.find({ category }).select([
        "-_id",
        "-__v",
        "-updatedAt",
      ]);
      if (posts.length < 1) {
        res.status(200).json({
          status: "Success",
          msg: "No posts found",
        });
      } else {
        res.status(200).json({
          status: "Success",
          posts,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Error",
      msg: error.message,
    });
  }
};
const searchBar = async (req, res) => {
  try {
    const { searchwords } = req.body;
    if (!searchwords) {
      res.status(400);
      throw Error("Enter keyword, phrase or sentence");
    } else {
      const query = { $text: { $search: searchwords } };
      const posts = await Post.find(query).select([
        "-_id",
        "-__v",
        "-updatedAt",
      ]);
      if (posts.length < 1) {
        res.status(200).json({
          status: "Success",
          msg: "No posts found",
        });
      } else {
        const query = { $text: { $search: searchword } };
        const posts = await Post.find(query).select([
          "-_id",
          "-__v",
          "-updatedAt",
        ]);

        res.status(200).json({
          status: "Success",
          posts,
        });
      }
    }
  } catch (error) {
    res.json({
      status: "Error",
      msg: error.message,
    });
  }
};
module.exports = {
  blogSignUp,
  blogSignIn,
  createPost,
  allPosts,
  searchCategories,
  searchBar,
};
