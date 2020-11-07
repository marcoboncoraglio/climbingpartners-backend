import mongoose, { Schema, Document } from "mongoose";

export interface ILocationInterface extends Document {
  lat: number;
  lng: number;
}

const locationSchema: Schema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
    ref: 'userLogin',
    required: true,
    index: true
  },
  lat: {
    type: Number,
    required: true,
    default: 0,
  },
  lng: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model<ILocationInterface>("location", locationSchema);
