import { FanHuaJi } from '../libs/fanhuaji/index';
import { Converter } from '../libs/fanhuaji/types';
import { resolveOutPath } from './helpers';
import { getFileLinesStream, createWriteFileStream } from '../utils';

interface ConvertFileParameters {
    fanHuaJi: FanHuaJi;
    inPath: string;
    outPath: string;
    shouldReplace: boolean;
    inEncoding?: string;
    converter: Converter;
}

export async function convertFile({
    fanHuaJi,
    inPath,
    outPath,
    shouldReplace,
    inEncoding,
    converter,
}: ConvertFileParameters): Promise<void> {
    console.log('Converting', inPath);

    const fileLineStream = await getFileLinesStream({
        providedEncoding: inEncoding,
        filePath: inPath,
    });

    const resolvedOutPath = await resolveOutPath({
        inPath,
        outPath,
        shouldReplace,
    });

    const writeStream = await createWriteFileStream(resolvedOutPath);

    await new Promise((resolve, reject) => {
        fileLineStream
            .pipe(
                fanHuaJi.convertFromStream({
                    converter,
                }),
            )
            .on('error', reject)
            .pipe(writeStream)
            .on('error', reject)
            .on('finish', resolve);
    });

    console.log('Done converting', inPath);
}
