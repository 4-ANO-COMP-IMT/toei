import { Schema, model } from "mongoose";

export interface Counter {
    name: string;
    value: number;      // default 0
    maxValue: number;   //de 0 até valor máximo, se = a 0, não tem limite
}
const CounterSchema = new Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true, default: 0 },
    maxValue: { type: Number, required: true, default: 0 }
  });

export interface Information {
    name: string;
    content: string;
}
// make sure name and content are required
const InformationSchema = new Schema({
    name: { type: String, required: true },
    content: { type: String, required: true }
});

export interface Artwork {
    title: string;
    description: string;
    counters: Counter[];
    tags: string[];
    informations: Information[];
    img: string;
}

const ArtworkSchema = new Schema<Artwork>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    counters: { type: [CounterSchema], required: true, default: [] },
    tags: { type: [String], required: true, default: [] },
    informations: { type: [InformationSchema], required: true, default: [] },
    img: { type: String, required: true, default: "" }
});

export interface Artworks {
    login: string;
    artworks: Artwork[];
}

const ArtworksSchema = new Schema<Artworks>({
    login: { type: String, required: true , unique: true},
    artworks: { type: [ArtworkSchema], required: true, default: []}
});

export const ArtworksModel = model<Artworks>("User", ArtworksSchema);
