const mongoose = require("mongoose");
const moment = require("moment");
const schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *    schemas:
 *      post:
 *        type: object
 *        required:
 *          - title
 *          - category
 *          - body
 *        properties:
 *          title:
 *               type: string
 *          category:
 *               type: string
 *          images:
 *               type: array
 *               description: Upload post images
 *               images:
 *                 type: string
 *                 format: binary
 *               encoding:
 *                images:
 *                 contentType: image/png, image/jpeg
 *        example:
 *          title: Blog Post Title
 *          category: Blog Category e.g. Business
 *          body: Bost Post Body
 *          images: image
 */

/**
 * @swagger
 * components:
 *    schemas:
 *      searchbar:
 *        type: object
 *        required:
 *          - searchwords
 *        properties:
 *          searchwords:
 *                type: string
 *        example:
 *          searchwords: Seamless Nigerian Transactions
 */

const blogPostSchema = new schema(
  {
    title: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      enum: [
        "technology",
        "cryptocurrency",
        "business",
        "trade",
        "uncategorized",
      ],
      default: "uncategorized",
    },
    body: {
      type: String,
      trim: true,
    },
    images: {
      type: Array,
    },
    author: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

blogPostSchema.index({ title: "text" });
const blogPost = mongoose.model("blogPost", blogPostSchema);
module.exports = blogPost;
