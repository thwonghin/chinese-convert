import * as fs from 'fs';
import * as path from 'path';
import * as jschardet from 'jschardet';
import * as iconv from 'iconv-lite';

import { FanHuaJi } from './libs/fanhuaji/index';
import { Converter } from './libs/fanhuaji/types';
import { isFile, isFilePathExist } from './utils';

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

async function resolveOutPath({
    inPath,
    outPath,
}: Pick<ConvertFileParams, 'inPath' | 'outPath'>): Promise<string> {
    let result = outPath;

    if (!(await isFilePathExist(outPath)) || !(await isFile(outPath))) {
        result = path.resolve(`${outPath}`, path.basename(inPath));
    }

    if (inPath === result) {
        const parsed = path.parse(result);
        return path.format({
            ...parsed,
            name: `${parsed.name}-new`,
            base: undefined,
        });
    }

    return result;
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

    const resolvedOutPath = await resolveOutPath({
        inPath,
        outPath,
    });

    await fs.promises.mkdir(path.dirname(resolvedOutPath), { recursive: true });
    await fs.promises.writeFile(resolvedOutPath, result.data.text, 'utf-8');

    return {
        text: result.data.text,
        diff: result.data.diff,
    };
}
