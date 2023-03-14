import * as fs from 'fs';
import * as path from 'path';
import * as iconv from 'iconv-lite';
import split2 from 'split2';
import languageEncoding from 'detect-file-encoding-and-language';
import { Transform } from 'stream';
import type { TransformCallback } from 'stream';

export async function isFilePathExist(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath);
        return true;
    } catch {
        return false;
    }
}

export async function isFile(filePath: string): Promise<boolean> {
    const lstat = await fs.promises.lstat(filePath);
    return lstat.isFile();
}

class BufferedLinesTransform extends Transform {
    buffer = '';

    constructor(private readonly thresholdCharCount: number) {
        super();
    }

    _transform(
        chunk: ArrayBuffer,
        _: BufferEncoding,
        callback: TransformCallback,
    ): void {
        const str = Buffer.from(chunk).toString('utf-8');

        if (this.shouldWrite(str)) {
            callback(null, this.buffer);
            this.buffer = str;
        } else {
            this.appendBuffer(str);
            callback();
        }
    }

    _flush(callback: TransformCallback): void {
        callback(null, this.buffer);
    }

    private shouldWrite(str: string): boolean {
        return (
            this.buffer.length + str.length + '\n'.length >
            this.thresholdCharCount
        );
    }

    private appendBuffer(str: string): void {
        if (this.buffer === '') {
            this.buffer = str;
        } else {
            this.buffer += '\n' + str;
        }
    }
}

type GetFileContentParameters = {
    filePath: string;
    providedEncoding?: string;
    bufferThresholdCharCount?: number;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const DEFAULT_BUFFER_THRESHOLD_CHAR_COUNT = 100 * 1024; // 100 KB

export async function getFileLinesStream({
    filePath,
    providedEncoding,
    bufferThresholdCharCount = DEFAULT_BUFFER_THRESHOLD_CHAR_COUNT,
}: GetFileContentParameters): Promise<Transform> {
    const encoding =
        providedEncoding ?? (await languageEncoding(filePath)).encoding;
    if (!encoding) {
        throw new Error(
            'Cannot detect encoding, please enter encoding manually. See --help.',
        );
    }

    const fileStream = fs.createReadStream(filePath);
    return fileStream
        .pipe(iconv.decodeStream(encoding))
        .pipe(split2())
        .pipe(new BufferedLinesTransform(bufferThresholdCharCount))
        .on('close', () => {
            fileStream.destroy();
        });
}

export async function createWriteFileStream(
    filePath: string,
): Promise<fs.WriteStream> {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    return fs.createWriteStream(filePath, 'utf-8');
}

export function isAscii(str: string): boolean {
    // eslint-disable-next-line no-control-regex
    return /^[\x00-\x7F]*$/.test(str);
}
