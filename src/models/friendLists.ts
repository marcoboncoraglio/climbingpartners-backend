import mongoose, {Schema, Document} from 'mongoose';

export interface IFriendLists extends Document {
    friendList: [string];
    friendRequests: [string];
  }

const friendListsSchema: Schema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        default: new mongoose.Types.ObjectId()
    },
    friendList: {
        type: [String],
        required: true,
    },
    friendRequests: {
        type: [String],
        required: true,
    }
});

export default mongoose.model<IFriendLists>('friendLists', friendListsSchema);

