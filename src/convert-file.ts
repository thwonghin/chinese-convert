import * as fs from 'fs';
import * as path from 'path';
import * as jschardet from 'jschardet';
import * as iconv from 'iconv-lite';

import { FanHuaJi } from './libs/fanhuaji/index';
import { Converter } from './libs/fanhuaji/types';

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
    const encoding =
        inEncoding ||
        jschardet.detect(fileBuffer, {
            minimumThreshold: 0.96,
        }).encoding;

    if (!encoding) {
        throw new Error(
            'Cannot detect encoding, please enter encoding manually. See --help.',
        );
    }
    const fileContent = iconv.decode(fileBuffer, encoding.toLowerCase());

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
