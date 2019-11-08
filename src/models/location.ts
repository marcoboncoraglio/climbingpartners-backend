import mongoose, {Schema, Document} from 'mongoose';

export interface ILocationInterface extends Document {
    lat: Number;
    lng: Number;
  }

const locationSchema: Schema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        default: new mongoose.Types.ObjectId()
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
});

export default mongoose.model<ILocationInterface>('location', locationSchema);
