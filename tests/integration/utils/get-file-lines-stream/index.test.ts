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
                        .on('data', (data: ArrayBuffer) => {
                            text += Buffer.from(data).toString('utf8');
                        });
                });
                expect(text).toBe(testParameters.result);
            });
        }
    });

    describe.each`
        condition                | filename                 | result
        ${'first line is long'}  | ${'long-first-row.txt'}  | ${['This is a very long line', 'short\nshort', 'short', 'This is a very long line']}
        ${'first line is short'} | ${'short-first-row.txt'} | ${['short\nshort', 'short', 'This is a very long line', 'short']}
        ${'all lines are short'} | ${'short-lines.txt'}     | ${['s\ns\ns\ns']}
        ${'all lines are long'}  | ${'long-lines.txt'}      | ${['This is a very long line', 'This is a very long line', 'This is a very long line']}
    `('when $condition', (testParameters: TestParameters) => {
        beforeAll(async () => {
            readableStream = await getFileLinesStream({
                filePath: path.resolve(__dirname, testParameters.filename),
                providedEncoding: testParameters.encoding,
                bufferThresholdCharCount: 15,
            });
        });

        it('should return correct result', async () => {
            const lines: string[] = [];

            await new Promise((resolve) => {
                readableStream
                    .on('end', resolve)
                    .on('data', (data: ArrayBuffer) => {
                        lines.push(Buffer.from(data).toString('utf8'));
                    });
            });

            expect(lines).toEqual(testParameters.result);
        });
    });
});
