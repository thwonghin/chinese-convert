import fs from 'fs';
import path from 'path';

import { FanHuaJi } from './libs/fanhuaji/index.js';
import { Converter } from './libs/fanhuaji/types.js';

interface ConvertFileParams {
    inPath: string;
    outPath: string;
    converter: Converter;
}

interface ConvertFileResult {
    text: string;
    diff: string | null;
}

export async function convertFile({
    inPath,
    outPath,
    converter,
}: ConvertFileParams): Promise<ConvertFileResult> {
    const fileContent = await fs.promises.readFile(inPath, 'utf-8');

    const fanHuaJi = new FanHuaJi();

    const result = await fanHuaJi.convert({
        text: fileContent,
        converter,
    });

    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    await fs.promises.writeFile(outPath, result.data.text, 'utf8');

    return {
        text: result.data.text,
        diff: result.data.diff,
    };
}
