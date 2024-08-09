import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
    clerkId:{
        type:String,
        required:true
    },
  userName: {
    type: String,
    requried: true,
    unique: true,
  },
  email: {
    type: String,
    requried: true,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  photo: {
    type: String,
    required: true,
  },
  planId: {
    type: Number,
    default: 1,
  },
  creditBalance: {
    type: Number,
    default: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models?.User || model("User", UserSchema);

export default User;