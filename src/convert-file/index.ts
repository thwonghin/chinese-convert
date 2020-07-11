import { FanHuaJi } from '../libs/fanhuaji/index';
import { Converter } from '../libs/fanhuaji/types';
import { resolveOutPath } from './helpers';
import { getFileContent, createAndWriteFile } from '../utils';

interface ConvertFileParams {
    fanHuaJi: FanHuaJi;
    inPath: string;
    outPath: string;
    shouldReplace: boolean;
    inEncoding?: string;
    converter: Converter;
}

interface ConvertFileResult {
    text: string;
    diff: string | null;
}

export async function convertFile({
    fanHuaJi,
    inPath,
    outPath,
    shouldReplace,
    inEncoding,
    converter,
}: ConvertFileParams): Promise<ConvertFileResult> {
    console.log('Converting', inPath);

    const fileContent = await getFileContent({
        providedEncoding: inEncoding,
        filePath: inPath,
    });

    const result = await fanHuaJi.convert({
        text: fileContent,
        converter,
    });

    const resolvedOutPath = await resolveOutPath({
        inPath,
        outPath,
        shouldReplace,
    });

    await createAndWriteFile({
        filePath: resolvedOutPath,
        content: result.data.text,
    });

    console.log('Done converting', inPath);
    return {
        text: result.data.text,
        diff: result.data.diff,
    };
}
