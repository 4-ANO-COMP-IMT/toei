import { Schema, model } from "mongoose";

export interface IFilters {
    title: string;
    tags: string[];
    filters: string[];
    sort: string;
    order: boolean;// true ascending, false descending
}

export interface ICounter {
    name: string;
    value: number;      // default 0
    maxValue: number;   //de 0 até valor máximo, se = a 0, não tem limite
}
const CounterSchema = new Schema({
    name: { type: String, required: false },
    value: { type: Number, required: false },
    maxValue: { type: Number, required: false }
  });

export interface IArtwork {
    title: string;
    description: string;
    counter: ICounter;
    tags: string[];
    img: string;
}

const ArtworkSchema = new Schema<IArtwork>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    counter: { type: CounterSchema, required: false, default:{}, _id: false },
    tags: { type: [String], required: false, default: [] },
    img: { type: String, required: true}
});

export interface IArtworks {
    _id: string;
    login: string;
    artwork: IArtwork;
}

const ArtworksSchema = new Schema<IArtworks>({
    login: { type: String, required: true },
    artwork: { type: ArtworkSchema, required: true, _id: false },
    _id: { type: String, required: true }
});

export const ArtworksModel = model<IArtworks>('Artworks', ArtworksSchema, 'artworks');
