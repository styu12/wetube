import bcrypt from "bcrypt";
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;
