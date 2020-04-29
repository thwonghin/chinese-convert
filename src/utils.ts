import * as fs from 'fs';

export async function isFilePathExist(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath);
        return true;
    } catch (e) {
        return false;
    }
}

export async function isFile(filePath: string): Promise<boolean> {
    const lstat = await fs.promises.lstat(filePath);
    return lstat.isFile();
}
