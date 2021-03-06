import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDetailsInterface extends Document {
  about: string;
  availableEquipment: [string];
  climbingStyles: [string];
  languagesSpoken: [string];
}

const userDetailsSchema: Schema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
    ref: 'userLogin',
    required: true,
    index: true
  },
  about: {
    type: String,
    default: 'Hi there!',
  },
  availableEquipment: {
    type: [String],
    default: ['60m Rope'],
  },
  climbingStyles: {
    type: [String],
    default: ['Lead', 'Bouldering'],
  },
  languagesSpoken: {
    type: [String],
    default: ['English'],
  },
  birthday: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model<IUserDetailsInterface>(
  'userDetails',
  userDetailsSchema
);
