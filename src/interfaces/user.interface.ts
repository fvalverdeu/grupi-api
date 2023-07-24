import { Document } from "mongoose";
import { IPreference } from "./preference.interface";

export interface IUser extends Document {
    email: string;
    password: string;
    code: string;
    status: string;
    profile: IUserProfile;

    comparePassword: (password: string) => Promise<boolean>;
}

export interface IUserProfile {
    name: string;
    lastname: string;
    birthdate: Date;
    gender: number;
    imageUrl: string;
    preferenceList: IPreference[];
}