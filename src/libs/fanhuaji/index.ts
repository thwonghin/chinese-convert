import { isAscii } from '../../utils';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';
import { Transform } from 'stream';

import type {
    ConvertRequestParameters,
    ConvertResponse,
    Response,
} from './types';
import { Converter } from './types';

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

function throwIfError<T>(response: Response<T>): void {
    if (response.code !== 0) {
        throw new Error(`${response.msg} (${response.code})`);
    }
}

export class FanHuaJi {
    #api: AxiosInstance;

    constructor() {
        this.#api = axios.create({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            baseURL: 'https://api.zhconvert.org',
        });
        axiosRetry(this.#api, {
            retries: 3,
            retryDelay: exponentialDelay,
            retryCondition(error) {
                return (
                    !error.response ||
                    error.response.status === 429 ||
                    error.response.status >= 500
                );
            },
            onRetry(retryCount, error) {
                console.log(
                    'Retrying... count: ',
                    retryCount,
                    'Status Code: ',
                    error.response?.status ?? 'None',
                );
            },
        });
    }

    convertFromStream(
        parameters: Omit<ConvertRequestParameters, 'text'>,
    ): Transform {
        return new Transform({
            transform: async (chunk: ArrayBuffer, _, callback) => {
                const text = Buffer.from(chunk).toString('utf8');
                if (isAscii(text)) {
                    callback(null, `${text}\n`);
                    return;
                }

                await this.convert({
                    ...parameters,
                    text,
                })
                    .then(({ data }) => {
                        callback(null, `${data.text}\n`);
                    })
                    .catch((error: Error) => {
                        callback(error, null);
                    });
            },
        });
    }

    async convert(parameters: ConvertRequestParameters) {
        const response = await this.#api.post<ConvertResponse>(
            '/convert',
            parameters,
        );
        throwIfError(response.data);

        return response.data;
    }
}
