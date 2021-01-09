import * as path from 'path';

import {getFileContent} from '@/utils';

interface TestParameters {
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
    `('when $condition', (testParameters: TestParameters) => {
        async function setup() {
            try {
                result = await getFileContent({
                    filePath: path.resolve(__dirname, testParameters.filename),
                    providedEncoding: testParameters.encoding,
                });
            } catch (error_: unknown) {
                error = error_ as Error;
            }
        }

        if (testParameters.isError) {
            it('should throw error', async () => {
                expect.assertions(1);
                await setup();

                expect(error.message).toBe(
                    'Cannot detect encoding, please enter encoding manually. See --help.',
                );
            });
        } else {
            it('should return correct result', async () => {
                expect.assertions(1);
                await setup();

                expect(result).toStrictEqual(testParameters.result);
            });
        }
    });
});
