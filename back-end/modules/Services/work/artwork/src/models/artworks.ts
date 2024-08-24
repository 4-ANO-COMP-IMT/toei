import { Schema, model } from "mongoose";

export interface ICounter {
    name: string;
    value: number;      // default 0
    maxValue: number;   //de 0 até valor máximo, se = a 0, não tem limite
}
const CounterSchema = new Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true, default: 0 },
    maxValue: { type: Number, required: true, default: 0 }
  });

export interface IInformation {
    name: string;
    content: string;
}
// make sure name and content are required
const InformationSchema = new Schema({
    name: { type: String, required: true },
    content: { type: String, required: true }
});

export interface IArtwork {
    title: string;
    description: string;
    counters: ICounter[];
    tags: string[];
    informations: IInformation[];
    img: string;
}

const ArtworkSchema = new Schema<IArtwork>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    counters: { type: [CounterSchema], required: true, default: [] },
    tags: { type: [String], required: true, default: [] },
    informations: { type: [InformationSchema], required: true, default: [] },
    img: { type: String, required: true, default: "" }
});

export interface IArtworks {
    login: string;
    artworks: IArtwork[];
}

const ArtworksSchema = new Schema<IArtworks>({
    login: { type: String, required: true , unique: true},
    artworks: { type: [ArtworkSchema], required: true, default: []}
});

export const ArtworksModel = model<IArtworks>('User', ArtworksSchema, 'artworks');
