import * as path from 'path';

import { getFileContent } from '@/utils';

interface TestParams {
    filename: string;
    encoding?: string;
    result?: string;
    isError: boolean;
}

describe('getFileContent', () => {
    let result: string | undefined;
    let error: Error | undefined;

    describe.each`
        condition                                              | filename              | encoding     | result                | isError
        ${'not provide encoding but can auto detect'}          | ${'big5.txt'}         | ${undefined} | ${'測試一二三四五六'} | ${false}
        ${'not provide encoding and cannot detect'}            | ${'undetectable.txt'} | ${undefined} | ${undefined}          | ${true}
        ${'provided custom encoding for auto detectable file'} | ${'big5.txt'}         | ${'utf8'}    | ${'���դ@�G�T�|����'}  | ${false}
        ${'provided custom encoding for undetectable file'}    | ${'undetectable.txt'} | ${'big5'}    | ${'測試'}             | ${false}
    `('when $condition', (testParams: TestParams) => {
        beforeAll(async () => {
            try {
                result = await getFileContent({
                    filePath: path.resolve(__dirname, testParams.filename),
                    providedEncoding: testParams.encoding,
                });
            } catch (e) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                error = e;
            }
        });

        if (!testParams.isError) {
            it('should return correct result', () => {
                expect(result).toEqual(testParams.result);
            });
        } else {
            it('should throw error', () => {
                expect(error.message).toBe(
                    'Cannot detect encoding, please enter encoding manually. See --help.',
                );
            });
        }
    });
});
