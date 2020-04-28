import * as yargs from 'yargs';
import * as iconv from 'iconv-lite';
import * as path from 'path';

import { converters } from './libs/fanhuaji/index';
import { Converter } from './libs/fanhuaji/types';
import { isFilePathExist } from './utils';
import { convertFile } from './convert-file';

async function main(): Promise<void> {
    const args = yargs
        .option('i', {
            alias: 'in',
            describe: 'Input file path',
            demand: true,
            type: 'string',
        })
        .option('o', {
            alias: 'out',
            describe: 'Output file path',
            demand: true,
            type: 'string',
        })
        .option('c', {
            alias: 'converter',
            describe: 'FanHuaJi converter name',
            demand: true,
            type: 'string',
        })
        .option('e', {
            alias: 'encoding',
            describe: 'Input file encoding. Auto-detect if not provided.',
            type: 'string',
        }).argv;

    if (!(converters as string[]).includes(args.c)) {
        throw new Error(
            `Unknown converter "${
                args.c
            }". It should be one of:\n  [${converters.join(', ')}]`,
        );
    }

    const cwd = process.cwd();

    const inPath = path.resolve(cwd, args.i);
    const outPath = path.resolve(cwd, args.o);

    if (!(await isFilePathExist(inPath))) {
        throw new Error(`File "${args.i}" does not exist.`);
    }

    if (args.e && !iconv.encodingExists(args.e)) {
        throw new Error(`Unknown encoding "${args.e}".`);
    }

    if (inPath === outPath) {
        throw new Error('In and out filepath cannot be the same.');
    }

    await convertFile({
        inPath,
        outPath,
        converter: args.c as Converter,
        inEncoding: args.e,
    });

    console.log('Conversion done!');
}

main()
    .then(() => process.exit())
    .catch((error: Error) => {
        console.error(error.message);
        console.error();
        process.exit(1);
    });
