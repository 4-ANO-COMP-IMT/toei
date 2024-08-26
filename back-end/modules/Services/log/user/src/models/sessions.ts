import { Schema, model } from "mongoose";

export interface ICookieConfig {
    login: string;
    session: string;
    _expires: string;
    maxAge: number;
}
export interface ISession {
    _id: string;
    expires: Date;
    session: string;
}

const SessionSchema = new Schema<ISession>({
    _id: { type: String, required: true },
    expires: { type: Date, required: true },
    session: { type: String, required: true }
});

export const SessionModel = model<ISession>("Session", SessionSchema, "sessions");