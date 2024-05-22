import { Schema, model } from "mongoose";

interface IUser {
    id: number;
    nome: string;
    dataDeNascimento: Date;
    login: string;
    senha: string;
    email: string;
    cpf: string;
}
const UserSchema = new Schema<IUser>({
    id: { type: Number, required: true , unique: true},
    nome: { type: String, required: true },
    dataDeNascimento: { type: Date, required: true },
    login: { type: String, required: true , unique: true},
    senha: { type: String, required: true },
    email: { type: String, required: true , unique: true},
    cpf: { type: String, required: true , unique: true},
});

export const User = model<IUser>("User", UserSchema);
