import * as path from 'path';
import * as fs from 'fs';
import { createWriteFileStream } from '@/utils';

interface TestParameters {
    filepath: string;
    isError: boolean;
}

const temporaryDirectoryPath = path.resolve(__dirname, 'temp');

const existingFileName = 'existing.txt';

async function initSetup(): Promise<void> {
    await fs.promises.rm(temporaryDirectoryPath, {
        recursive: true,
        force: true,
    });
    await fs.promises.mkdir(temporaryDirectoryPath, {
        recursive: true,
    });
    await fs.promises.writeFile(
        path.resolve(temporaryDirectoryPath, existingFileName),
        '',
    );
}

afterAll(async () => {
    await fs.promises.rm(temporaryDirectoryPath, {
        recursive: true,
        force: true,
    });
});

describe('createWriteFileStream', () => {
    describe.each`
        condition                      | filepath
        ${'directory does not exists'} | ${'1/2/3/4/test.txt'}
        ${'directory exists'}          | ${'test2.txt'}
        ${'file exists'}               | ${existingFileName}
    `('when $condition', (testParameters: TestParameters) => {
        let fileStream: NodeJS.WritableStream;
        beforeAll(async () => {
            await initSetup();

            fileStream = await createWriteFileStream(
                path.resolve(temporaryDirectoryPath, testParameters.filepath),
            );
        });

        it('should write file with correct content', async () => {
            await new Promise((resolve) => {
                fileStream.write('text-content', resolve);
                fileStream.end();
            });
            const result = await fs.promises.readFile(
                path.resolve(temporaryDirectoryPath, testParameters.filepath),
                'utf8',
            );

            expect(result).toBe('text-content');
        });
    });
});
