import fs from 'fs';
import path from 'path';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';

import { FanHuaJi } from './libs/fanhuaji/index.js';
import { Converter } from './libs/fanhuaji/types.js';

interface ConvertFileParams {
    inPath: string;
    outPath: string;
    inEncoding?: string;
    converter: Converter;
}

interface ConvertFileResult {
    text: string;
    diff: string | null;
}

export async function convertFile({
    inPath,
    outPath,
    inEncoding,
    converter,
}: ConvertFileParams): Promise<ConvertFileResult> {
    const fileBuffer = await fs.promises.readFile(inPath);
    const encoding = inEncoding || jschardet.detect(fileBuffer).encoding.toLowerCase();
    const fileContent = iconv.decode(fileBuffer, encoding);

    const fanHuaJi = new FanHuaJi();

    const result = await fanHuaJi.convert({
        text: fileContent,
        converter,
    });

    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    await fs.promises.writeFile(outPath, result.data.text, 'utf-8');

    return {
        text: result.data.text,
        diff: result.data.diff,
    };
}
