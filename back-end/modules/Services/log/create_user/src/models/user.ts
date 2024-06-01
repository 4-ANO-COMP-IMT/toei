import { Schema, model } from "mongoose";

export interface IUser {
    name: string;
    birthDate: Date;
    login: string;
    password: string;
    email: string;
}
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    birthDate: { type: Date, required: true },
    login: { type: String, required: true , unique: true},
    password: { type: String, required: true },
    email: { type: String, required: true , unique: true},
});

export const User = model<IUser>("User", UserSchema);
