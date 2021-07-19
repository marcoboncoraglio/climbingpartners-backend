import mongoose, { Schema, Document, PassportLocalSchema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export interface IUserLoginInterface extends Document {
  username: string;
  googleId: number;
}

let userLoginSchema: Schema = new Schema({
  username: {
    type: String,
  },
  googleId: {
    type: Number,
  },
});

userLoginSchema.plugin(passportLocalMongoose);

declare global {
  namespace Express {
      interface User extends IUserLoginInterface {}
  }
}

export default mongoose.model<IUserLoginInterface>(
  'userLogin',
  userLoginSchema as PassportLocalSchema
);
