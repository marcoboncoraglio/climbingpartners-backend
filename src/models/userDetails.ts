import mongoose, { Schema, Document } from "mongoose";

export interface IUserDetailsInterface extends Document {
  about: string;
  availableEquipment: [string];
  climbingStyles: [string];
  languagesSpoken: [string];
}

const userDetailsSchema: Schema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  about: {
    type: String,
    default: "Hi there!",
  },
  availableEquipment: {
    type: [String],
    default: ["60m Rope"],
  },
  climbingStyles: {
    type: [String],
    default: ["Lead", "Bouldering"],
  },
  languagesSpoken: {
    type: [String],
    default: ["English"],
  },
});

export default mongoose.model<IUserDetailsInterface>(
  "userDetails",
  userDetailsSchema
);
