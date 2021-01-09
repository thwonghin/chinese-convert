import * as fs from 'fs';
import * as path from 'path';
import * as jschardet from 'jschardet';
import * as iconv from 'iconv-lite';

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

interface GetFileContentParameters {
    filePath: string;
    providedEncoding?: string;
}

export async function getFileContent({
    filePath,
    providedEncoding,
}: GetFileContentParameters): Promise<string> {
    const fileBuffer = await fs.promises.readFile(filePath);
    const encoding =
        providedEncoding ||
        jschardet.detect(fileBuffer, {
            minimumThreshold: 0.96,
        }).encoding;

    if (!encoding) {
        throw new Error(
            'Cannot detect encoding, please enter encoding manually. See --help.',
        );
    }

    return iconv.decode(fileBuffer, encoding.toLowerCase());
}

interface CreateAndWriteFileParameters {
    filePath: string;
    content: string;
}

export async function createAndWriteFile({
    filePath,
    content,
}: CreateAndWriteFileParameters): Promise<void> {
    await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
    await fs.promises.writeFile(filePath, content, 'utf-8');
}
