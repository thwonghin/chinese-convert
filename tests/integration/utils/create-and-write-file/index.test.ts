import * as path from 'path';
import * as fs from 'fs';
import {createAndWriteFile} from '@/utils';

interface TestParameters {
    filepath: string;
    isError: boolean;
}

const temporaryDirectoryPath = path.resolve(__dirname, 'temp');
const existingFileName = 'existing.txt';

async function initSetup(): Promise<void> {
    await fs.promises.rmdir(temporaryDirectoryPath, {
        recursive: true,
    });
    await fs.promises.mkdir(temporaryDirectoryPath);
    await fs.promises.writeFile(
        path.resolve(temporaryDirectoryPath, existingFileName),
        '',
    );
}

afterAll(async () => {
    await fs.promises.rmdir(temporaryDirectoryPath, {
        recursive: true,
    });
});

describe('createAndWriteFile', () => {
    describe.each`
        condition                      | filepath
        ${'directory does not exists'} | ${'1/2/3/4/test.txt'}
        ${'directory exists'}          | ${'test2.txt'}
        ${'file exists'}               | ${existingFileName}
    `('when $condition', (testParameters: TestParameters) => {
        beforeAll(async () => {
            await initSetup();

            await createAndWriteFile({
                filePath: path.resolve(
                    temporaryDirectoryPath,
                    testParameters.filepath,
                ),
                content: 'test-content',
            });
        });

        it('should write file with correct content', async () => {
            const result = await fs.promises.readFile(
                path.resolve(temporaryDirectoryPath, testParameters.filepath),
                'utf8',
            );

            expect(result).toBe('test-content');
        });
    });
});
