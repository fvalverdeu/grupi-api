import { IPlace } from "./place.interface";
import { IUser, IUserProfile } from "./user.interface";

export interface IGrupi {
    user: IUser;
    profile: IUserProfile;
    places: IPlace[];

}