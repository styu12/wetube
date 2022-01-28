import mongoose from "mongoose";
const { Schema } = mongoose;

const videoSchema = new Schema({
  title: { type: String, required: true, trim: true, maxLength: 50 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, required: true, trim: true }],
  meta: {
    rating: { type: Number, default: 0, required: true },
    views: { type: Number, default: 0, required: true },
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((tag) => tag.trim())
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
