import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
