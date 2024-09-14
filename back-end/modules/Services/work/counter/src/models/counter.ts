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

export interface IArtwork {
    counters: ICounter[];
}

const ArtworkSchema = new Schema<IArtwork>({
    counters: { type: [CounterSchema], required: false, _id: false, default: [] },
});

export interface IArtworks {
    login: string;
    artwork: IArtwork;
}

const ArtworksSchema = new Schema<IArtworks>({
    login: { type: String, required: true },
    artwork: { type: ArtworkSchema, required: true, _id: false }
});

export const ArtworksModel = model<IArtworks>('Artworks', ArtworksSchema, 'artworks');
