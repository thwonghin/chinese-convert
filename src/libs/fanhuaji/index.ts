import axios, { AxiosInstance } from 'axios';

import { ConvertRequestParams, ConvertResponse, Converter } from './types.js';

export const converters: Converter[] = [
    Converter.BPMF,
    Converter.CN,
    Converter.HK,
    Converter.MARS,
    Converter.PY,
    Converter.SC,
    Converter.TC,
    Converter.TW,
    Converter.WIKISC,
    Converter.WIKITC,
];

export class FanHuaJi {
    #api: AxiosInstance;

    constructor() {
        this.#api = axios.create({
            baseURL: 'https://api.zhconvert.org',
        });
    }

    public async convert(params: ConvertRequestParams): Promise<ConvertResponse> {
        const response = await this.#api.post<ConvertResponse>('/convert', params);

        return response.data;
    }
}