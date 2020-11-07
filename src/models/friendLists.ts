import mongoose, { Schema, Document } from "mongoose";

export interface IFriendLists extends Document {
  friendList: [string];
  friendRequests: [string];
}

const friendListsSchema: Schema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
    ref: 'userLogin',
    required: true,
    index: true
  },
  friendList: {
    type: [String],
    required: true,
    default: [],
  },
  friendRequests: {
    type: [String],
    required: true,
    default: [],
  },
});

export default mongoose.model<IFriendLists>("friendLists", friendListsSchema);
