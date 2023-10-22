import { Document } from "mongoose";
import { IPreference } from "./preference.interface";
import { IPlace } from "./place.interface";

export interface IUser extends Document {
    email: string;
    password: string;
    code: string;
    status: string;
    profile: IProfile;
    // places: IPlace[];
    places: any[];
    comparePassword: (password: string) => Promise<boolean>;
}

export interface IProfile {
    name: string;
    lastname: string;
    birthdate: Date;
    address: string;
    gender: number;
    imageUrl: string;
    preferenceList: IPreference[];
    professionalList: IPreference[];
}