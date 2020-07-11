import * as path from 'path';
import { isFilePathExist } from '@/utils';

interface TestParams {
    filepath: string;
    result: boolean;
}

describe('isFilePathExist', () => {
    describe.each`
        condition                      | filepath                          | result
        ${'the path is a file'}        | ${'./is-file-path-exist.test.ts'} | ${true}
        ${'the path is a directory'}   | ${'../utils'}                     | ${true}
        ${'the path does not resolve'} | ${'./random'}                     | ${false}
    `('when $condition', (testParams: TestParams) => {
        it('should return correct result', async () => {
            expect(
                await isFilePathExist(
                    path.resolve(__dirname, testParams.filepath),
                ),
            ).toBe(testParams.result);
        });
    });
});
