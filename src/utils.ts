import * as fs from 'fs';

export async function isFilePathExist(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath);
        return true;
    } catch (e) {
        return false;
    }
}
