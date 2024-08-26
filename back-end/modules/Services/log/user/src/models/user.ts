import { Schema, model } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    birthDate: Date;
    login: string;
    password: string;
}
export interface IUserInput {
    name: string;
    email: string;
    birthDate: string;
    login: string;
    password: string;
}
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true , unique: true},
    birthDate: { type: Date, required: true },
    login: { type: String, required: true , unique: true},
    password: { type: String, required: true }
});

export const UserModel = model<IUser>("User", UserSchema, "users");
