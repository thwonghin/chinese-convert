// https://docs.zhconvert.org/api/getting-started/#通用的-api-參數
type RequestParameters<T> = {
    apiKey?: string;
    outputFormat?: 'json' | 'yaml' | 'php';
    prettify?: boolean;
} & T;

// https://docs.zhconvert.org/api/getting-started/#api-回應的標準結構
export interface Response<T> {
    code: number;
    data: T;
    msg: string;
    revisions: {
        build: string;
        msg: string;
        time: number;
    };
    execTime: number;
}

export const enum Converter {
    SC = 'Simplified', // 簡體化
    TC = 'Traditional', // 繁體化
    CN = 'China', // 中國化
    HK = 'Hongkong', // 香港化
    TW = 'Taiwan', // 台灣化
    PY = 'Pinyin', // 拼音化
    BPMF = 'Bopomofo', // 注音化
    MARS = 'Mars', // 火星化
    WIKISC = 'WikiSimplified', // 維基簡體化
    WIKITC = 'WikiTraditional', // 維基繁體化
}

// https://docs.zhconvert.org/api/convert/#convert
export type ConvertRequestParameters = RequestParameters<{
    // https://docs.zhconvert.org/api/convert/#必填
    text: string;
    converter: Converter;

    // https://docs.zhconvert.org/api/convert/#字幕樣式
    ignoreTextStyles?: string;
    jpTextStyles?: string;

    // https://docs.zhconvert.org/api/convert/#日文的處理策略
    jpStyleConversionStrategy?:
        | 'none'
        | 'protect'
        | 'protectOnlySameOrigin'
        | 'fix';
    jpTextConversionStrategy?:
        | 'none'
        | 'protect'
        | 'protectOnlySameOrigin'
        | 'fix';

    // https://docs.zhconvert.org/api/convert/#自訂取代
    modules?: Record<string, -1 | 0 | 1>;
    userPostReplace?: string;
    userPreReplace?: string;
    userProtectReplace?: string;

    // https://docs.zhconvert.org/api/convert/#差異比較
    diffCharLevel?: boolean;
    diffContextLines?: 0 | 1 | 2 | 3 | 4;
    diffEnable?: boolean;
    diffIgnoreCase?: boolean;
    diffIgnoreWhiteSpaces?: boolean;
    diffTemplate?: 'Inline' | 'SideBySide' | 'Unified' | 'Context' | 'Json';

    // https://docs.zhconvert.org/api/convert/#文本整理
    cleanUpText?: boolean;
    ensureNewlineAtEof?: boolean;
    translateTabsToSpaces?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    trimTrailingWhiteSpaces?: boolean;
    unifyLeadingHyphen?: boolean;
}>;

// https://docs.zhconvert.org/api/convert/#回應參數
export type ConvertResponse = Response<{
    converter: Converter;
    text: string;
    diff: string | null;
    usedModules: string[];
    jpTextStyles: string[];
    textFormat: string;
}>;
