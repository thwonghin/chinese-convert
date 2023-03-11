import * as fs from 'fs';
import * as path from 'path';
import * as iconv from 'iconv-lite';
import split2 from 'split2';
import languageEncoding from 'detect-file-encoding-and-language';
import type { Transform } from 'stream';

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

type GetFileContentParameters = {
    filePath: string;
    providedEncoding?: string;
};

export async function getFileLinesStream({
    filePath,
    providedEncoding,
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
