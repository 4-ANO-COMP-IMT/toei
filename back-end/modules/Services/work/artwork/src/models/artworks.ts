import { Schema, model } from "mongoose";

interface Counter {
    name: string;
    value: number;      // default 0
    maxvalue: number;   //de 0 até valor máximo, se = a 0, não tem limite
}
const CounterSchema = new Schema({
    name: { type: String, required: true },
    value: { type: Number, required: false, default: 0 },
    maxValue: { type: Number, required: false, default: 0 }
  });

interface Information {
    name: string;
    content: string;
}

const InformationSchema = new Schema({
    name: { type: String, required: true },
    content: { type: String, required: true }
});

export interface Artwork {
    title: string;
    counters: Counter[];
    tags: string[];
    informations: Information[];
    img: string;
}

const ArtworkSchema = new Schema<Artwork>({
    title: { type: String, required: true },
    counters: { type: [CounterSchema], required: false, default: [] },
    tags: { type: [String], required: false, default: [] },
    informations: { type: [InformationSchema], required: false, default: [] },
    img: { type: String, required: false, default: "" }
});

export interface Artworks {
    login: string;
    artworks: Artwork[];
}

const ArtworksSchema = new Schema<Artworks>({
    login: { type: String, required: true , unique: true},
    artworks: { type: [ArtworkSchema], required: false, default: [] }
});

export const ArtworksModel = model<Artworks>("User", ArtworksSchema);
