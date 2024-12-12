const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      default:
        "https://www.blogtyrant.com/wp-content/uploads/2017/02/how-to-write-a-good-blog-post.png",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
