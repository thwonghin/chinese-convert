import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import {FanHuaJi} from '@/libs/fanhuaji';
import {Converter, ConvertResponse} from '@/libs/fanhuaji/types';

const axiosMock = new MockAdapter(axios);

function mockConvertResponse(data: any) {
    axiosMock.onPost('https://api.zhconvert.org/convert').reply(200, data);
}

describe('fanHuaJi', () => {
    describe('when the API response is code === 0', () => {
        let fanhuaji: FanHuaJi;
        let response: ConvertResponse;
        let error: Error;

        async function setup() {
            fanhuaji = new FanHuaJi();
            mockConvertResponse({code: 0});

            try {
                response = await fanhuaji.convert({
                    text: 'test',
                    converter: Converter.HK,
                });
            } catch (error_: unknown) {
                error = error_ as Error;
            }
        }

        async function teardown() {
            axiosMock.reset();
        }

        it('should call API with correct params', async () => {
            expect.assertions(3);
            await setup();
            expect(axiosMock.history.post[0].baseURL).toBe(
                'https://api.zhconvert.org',
            );
            expect(axiosMock.history.post[0].url).toBe('/convert');
            expect(JSON.parse(axiosMock.history.post[0].data)).toStrictEqual({
                text: 'test',
                converter: Converter.HK,
            });
            await teardown();
        });

        it('should return correct result', async () => {
            expect.assertions(1);
            await setup();
            expect(response).toStrictEqual({
                code: 0,
            });
            await teardown();
        });
    });

    describe('when the API response is code !== 0', () => {
        let fanhuaji: FanHuaJi;
        let response: ConvertResponse;
        let error: Error;

        async function setup() {
            fanhuaji = new FanHuaJi();
            mockConvertResponse({code: 100, msg: 'Unknown Error'});

            try {
                response = await fanhuaji.convert({
                    text: 'test',
                    converter: Converter.HK,
                });
            } catch (error_: unknown) {
                error = error_ as Error;
            }
        }

        async function teardown() {
            axiosMock.reset();
        }

        it('should call API with correct params', async () => {
            expect.assertions(3);
            await setup();
            expect(axiosMock.history.post[0].baseURL).toBe(
                'https://api.zhconvert.org',
            );
            expect(axiosMock.history.post[0].url).toBe('/convert');
            expect(JSON.parse(axiosMock.history.post[0].data)).toStrictEqual({
                text: 'test',
                converter: Converter.HK,
            });
            await teardown();
        });

        it('should have correct error message', async () => {
            expect.assertions(1);
            await setup();
            expect(error.message).toBe('Unknown Error (100)');
            await teardown();
        });
    });
});
