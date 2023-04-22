const mongoose = require("mongoose");
const schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     adminSignup:
 *       type: object
 *       required:
 *         - fullname
 *         - email
 *         - password
 *         - confirmpassword
 *       properties:
 *         fullname:
 *                 type: string
 *         email:
 *                 type: string
 *         password:
 *                 type: string
 *         confirmpassword:
 *                 type: string
 *       example:
 *         fullname: John Doe
 *         email: johndoe@example.com
 *         password: strongpassword123
 *         confirmpassword: strongpassword123
 * */

/**
 * @swagger
 * components:
 *    schemas:
 *      adminSignin:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *                type: string
 *          password:
 *                type: string
 *        example:
 *          email: johndoe@example.com
 *          password: strongpassword123
 */

const blogUserSchema = new schema({
  fullname: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
  },
});

const blogUser = mongoose.model("blogUser", blogUserSchema);
module.exports = blogUser;
