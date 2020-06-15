import mongoose, { Schema, Document } from "mongoose";

export interface IUserCardInterface extends Document {
  name: string;
  imgUrl: string;
}

const userCardSchema: Schema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: "Jimmy Hepp",
  },
  imgUrl: {
    type: String,
    default:
      "https://arc.sdsu.edu/images/aztecadventures/rock-climbing/headers/small/rock-climbing.jpg",
  },
});

export default mongoose.model<IUserCardInterface>("userCard", userCardSchema);
