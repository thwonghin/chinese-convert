import * as path from 'path';
import { isFilePathExist } from '@/utils';

type TestParameters = {
    filepath: string;
    result: boolean;
};

describe('isFilePathExist', () => {
    describe.each`
        condition                      | filepath                          | result
        ${'the path is a file'}        | ${'./is-file-path-exist.test.ts'} | ${true}
        ${'the path is a directory'}   | ${'../utils'}                     | ${true}
        ${'the path does not resolve'} | ${'./random'}                     | ${false}
    `('when $condition', (testParameters: TestParameters) => {
        it('should return correct result', async () => {
            expect(
                await isFilePathExist(
                    path.resolve(__dirname, testParameters.filepath),
                ),
            ).toBe(testParameters.result);
        });
    });
});
