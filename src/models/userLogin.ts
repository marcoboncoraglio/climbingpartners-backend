import mongoose, {Schema, Document, PassportLocalSchema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';


export interface IUserLoginInterface extends Document {
    username: string;
}

const userLoginSchema: Schema = new Schema({
    username: {
        type: String,
    },
});

userLoginSchema.plugin(passportLocalMongoose);

export default mongoose.model<IUserLoginInterface>('userLogin',
userLoginSchema as PassportLocalSchema);
