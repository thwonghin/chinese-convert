import * as path from 'path';
import { isFile } from '@/utils';

interface TestParams {
    filepath: string;
    result: boolean;
}

describe('isFilePathExist', () => {
    describe.each`
        condition                    | filepath                          | result
        ${'the path is a file'}      | ${'./is-file-path-exist.test.ts'} | ${true}
        ${'the path is a directory'} | ${'../utils'}                     | ${false}
    `('when $condition', (testParams: TestParams) => {
        it('should return correct result', async () => {
            expect(
                await isFile(path.resolve(__dirname, testParams.filepath)),
            ).toBe(testParams.result);
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
