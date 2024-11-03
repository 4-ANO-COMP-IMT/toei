import { Schema, model } from "mongoose";

export interface IUserLogin {
    login: string;
    password: string;
}
const LoginSchema = new Schema<IUserLogin>({
    login: { type: String, required: true , unique: true},
    password: { type: String, required: true}
});

export const UserLogin = model<IUserLogin>("User", LoginSchema, "users");