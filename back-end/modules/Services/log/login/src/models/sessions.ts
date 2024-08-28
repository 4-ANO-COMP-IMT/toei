import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

export interface ICookieConfig {
    login: string;
    session: string;
    _expires: Date;
    maxAge: number;
    ip_cookie: string;
}

interface ICookie {
    originalMaxAge: number;
    partitioned: boolean;
    priority: string;
    expires: string;
    secure: boolean;
    httpOnly: boolean;
    domain: string;
    path: string;
    sameSite: string;
}

const CookieSchema = new Schema<ICookie>({
    originalMaxAge: { type: Number, required: true },
    partitioned: { type: Boolean, required: true },
    priority: { type: String, required: true },
    expires: { type: String, required: true },
    secure: { type: Boolean, required: true },
    httpOnly: { type: Boolean, required: true },
    domain: { type: String, required: true },
    path: { type: String, required: true },
    sameSite: { type: String, required: true }
});

interface ISession {
    cookie: ICookie;
    login_cookie: string;
    ip_cookie: string;
}

const SessionSchema = new Schema<ISession>({
    cookie: { type: CookieSchema, required: true, _id: false },
    login_cookie: { type: String, required: true },
    ip_cookie: { type: String, required: true }
});

export interface ISessions {
    _id: string;
    expires: Date;
    session: ISession;
}

const SessionsSchema = new Schema<ISessions>({
    _id: { type: String, required: true },
    expires: { type: Date, required: true },
    session: { type: SessionSchema, required: true, _id: false }
});

export const SessionsModel = model<ISessions>("Session", SessionsSchema, "sessions");