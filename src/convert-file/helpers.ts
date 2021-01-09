import * as path from 'path';

import {isFile, isFilePathExist} from '../utils';

interface ResolveOutPathParameters {
    inPath: string;
    outPath: string;
    shouldReplace: boolean;
}

export async function resolveOutPath({
    inPath,
    outPath,
    shouldReplace,
}: ResolveOutPathParameters): Promise<string> {
    if (shouldReplace) {
        return inPath;
    }

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
