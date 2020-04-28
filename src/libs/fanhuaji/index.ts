import axios, { AxiosInstance } from 'axios';

import { ConvertRequestParams, ConvertResponse, Converter, Response } from './types';

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

    private throwIfError<T>(response: Response<T>): void {
        if (response.code !== 0) {
            throw new Error(`${response.msg} (${response.code})`);
        }
    }

    public async convert(params: ConvertRequestParams): Promise<ConvertResponse> {
        const response = await this.#api.post<ConvertResponse>('/convert', params);

        this.throwIfError(response.data);
        return response.data;
    }
}