import * as path from 'path';

import { getFileLinesStream } from '@/utils';

type TestParameters = {
    filename: string;
    encoding?: string;
    result?: string;
    isError: boolean;
};

describe('getFileLinesStream', () => {
    let readableStream: NodeJS.ReadableStream;
    let error: Error | undefined;

    describe.each`
        condition                                        | filename      | encoding     | result                | isError
        ${'not provide encoding with non-utf8 files'}    | ${'big5.txt'} | ${undefined} | ${'測試'}             | ${true}
        ${'not provide encoding with utf8 files'}        | ${'utf8.txt'} | ${undefined} | ${'測試'}             | ${false}
        ${'provided custom encoding for non-utf8 files'} | ${'big5.txt'} | ${'big5'}    | ${'測試一二三四五六'} | ${false}
        ${'provided custom encoding for utf8 files'}     | ${'utf8.txt'} | ${'utf8'}    | ${'測試'}             | ${false}
    `('when $condition', (testParameters: TestParameters) => {
        beforeAll(async () => {
            try {
                readableStream = await getFileLinesStream({
                    filePath: path.resolve(__dirname, testParameters.filename),
                    providedEncoding: testParameters.encoding,
                });
            } catch (error_: unknown) {
                error = error_ as Error;
            }
        });

        if (testParameters.isError) {
            it('should throw error', () => {
                expect(error?.message).toBe(
                    'Cannot detect encoding, please enter encoding manually. See --help.',
                );
            });
        } else {
            it('should return correct result', async () => {
                let text = '';

                await new Promise((resolve) => {
                    readableStream
                        .on('end', resolve)
                        .on('data', (data: string) => {
                            text += data;
                        });
                });
                expect(text).toEqual(testParameters.result);
            });
        }
    });
});
