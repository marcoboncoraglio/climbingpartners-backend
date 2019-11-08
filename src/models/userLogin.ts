import mongoose, {Schema, Document, PassportLocalSchema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';


export interface IUserLoginInterface extends Document {
    username: String;
}

const userLoginSchema: Schema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        default: new mongoose.Types.ObjectId()
    },
    username: {
        type: String
    }
});

userLoginSchema.plugin(passportLocalMongoose);

export default mongoose.model<IUserLoginInterface>('userLogin', userLoginSchema as PassportLocalSchema);
