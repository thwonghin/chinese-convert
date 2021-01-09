import * as path from 'path';
import {isFile} from '@/utils';

interface TestParameters {
    filepath: string;
    result: boolean;
}

describe('isFilePathExist', () => {
    describe.each`
        condition                    | filepath                          | result
        ${'the path is a file'}      | ${'./is-file-path-exist.test.ts'} | ${true}
        ${'the path is a directory'} | ${'../utils'}                     | ${false}
    `('when $condition', (testParameters: TestParameters) => {
        it('should return correct result', async () => {
            expect(
                await isFile(path.resolve(__dirname, testParameters.filepath)),
            ).toBe(testParameters.result);
        });
    });

    describe('when the file does not exists', () => {
        it('should throw error', async () => {
            await expect(
                isFile(path.resolve(__dirname, 'random')),
            ).rejects.toThrow();
        });
    });
});
