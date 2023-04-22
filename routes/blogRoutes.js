const express = require("express");
const router = express.Router();
const {
  blogSignUp,
  blogSignIn,
  createPost,
  allPosts,
  searchCategories,
  searchBar,
} = require("../controllers/blogControllers");
const blogAuthenticated = require("../middleware/blog/blogJwtAuthenticate");
const {
  blogUserSignupValidate,
  blogUserSigninValidate,
  postValidate,
} = require("../middleware/blog/blogValidator");
const checkUpload = require("../middleware/multerError");

/**
 * @swagger
 * /api/blog/signup:
 *   post:
 *     summary: Admin user signs up
 *     description: This enables the creation of a new admin user account.
 *     tags:
 *       - Blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/adminSignup'
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/adminSignup'
 *       500:
 *         description: Server error
 *       400:
 *         description: Bad request
 *
 * */

/**
 * @swagger
 * /api/blog/signin:
 *   post:
 *     summary: Admin blog user signs in
 *     description: Admin blogger signs into the created account.
 *     tags:
 *       - Blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/adminSignin'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/adminSignin'
 *       400:
 *         description: Bad request
 * */

/**
 * @swagger
 * /api/blog/post:
 *   post:
 *     summary: Create new blog post
 *     description: An admin creates a new blog post with title, category, body and images of post. After creating a new post, the admin is redirected to the endpoint to get all the posts.This route is a protected route accessible to admins only.
 *     tags:
 *       - Blog
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/post'
 *     responses:
 *       201:
 *         description: Blog Post Created
 *         content:
 *           multipart/form-data:
 *             schema:
 *               $ref: '#/components/schemas/post'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server Error
 * */

/**
 * @swagger
 * /api/blog/posts:
 *   get:
 *     summary: gets all blog posts
 *     description: All available blog posts are viewed with this route.
 *     tags:
 *       - Blog
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 * */

/**
 * @swagger
 * /api/blog/searchbar:
 *   get:
 *     summary: Users search with search bar
 *     description: This endpoint is used to search for blog posts. The keyword, phrase or sentence entered in the search bar is used to match titles of existing post and return such posts.
 *     tags:
 *       - Blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/searchbar'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/searchbar'
 *       400:
 *         description: Bad request
 * */

/**
 * @swagger
 * /api/blog/postCategory?category=business:
 *   get:
 *     summary: User search with category parameter
 *     description: This endpoint searches for blog posts match category for the query parameter to the categories(which are business, cryptocurrency, trade, and technology) of matching posts and returns the matched posts.
 *     tags:
 *       - Blog
 *     parameters:
 *       - name: category
 *         in: query
 *         description: a post category
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request

 * */
//Signup and Signin Routes
router.post("/signup", blogUserSignupValidate, blogSignUp);
router.post("/signin", blogUserSigninValidate, blogSignIn);

//Blog post Routes
router.post("/post", blogAuthenticated, checkUpload, postValidate, createPost);
router.get("/posts", allPosts);
router.get("/searchbar", searchBar);
router.get("/postCategory", searchCategories);
module.exports = router;
