import { CallbackError, model, Schema } from "mongoose";

import bcrypt from 'bcrypt';
import { IUser } from "../interfaces/user.interface";
import { EUserStatus } from "../constants/user.enum";

const userSchema = new Schema({
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    code: { type: String, required: true, default: '' },
    status: { type: String, required: true, default: EUserStatus.UNVERIFIED },
    profile: {
        name: { type: String },
        lastname: { type: String },
        birthdate: { type: Date },
        address: { type: String },
        gender: { type: Number },
        imageUrl: { type: String },
        preferenceList: [{ type: String }],
    },
    places: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
});

userSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

// userSchema.pre<IUser>('findOneAndUpdate', async function (next) {
//     const user = this;
//     if (!user.isModified('password')) return next();

//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(user.password, salt);
//         user.password = hash;
//         return next();
//     } catch (error) {
//         console.log(error);
//     }
// });

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export default model<IUser>('User', userSchema);