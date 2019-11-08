import mongoose, {Schema, Document} from 'mongoose';

export interface ILocationInterface extends Document {
    lat: number;
    lng: number;
  }

const locationSchema: Schema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    }
});

export default mongoose.model<ILocationInterface>('location', locationSchema);
