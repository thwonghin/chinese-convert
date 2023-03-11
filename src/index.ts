#!/usr/bin/env node

import * as yargs from 'yargs';
import * as iconv from 'iconv-lite';
import * as path from 'path';
import fg from 'fast-glob';

import { converters, FanHuaJi } from './libs/fanhuaji';
import type { Converter } from './libs/fanhuaji/types';
import { convertFile } from './convert-file';

async function main(): Promise<void> {
    const args = await yargs
        .usage('Usage: $0 [file glob patterns]')
        .example(
            '$0 -c Hongkong -o out in/*.txt',
            'convert all "in/*.txt" files to Hong Kong Chinese and output to "out" folder',
        )
        .help('h')
        .alias('h', 'help')
        .version('v')
        .alias('v', 'version')
        .option('o', {
            alias: 'out',
            describe: 'Output file path',
            type: 'string',
        })
        .option('c', {
            alias: 'converter',
            describe: `FanHuaJi converter name.\nSupported: [${converters.join(
                ', ',
            )}]`,
            demand: true,
            type: 'string',
        })
        .option('e', {
            alias: 'encoding',
            describe: 'Input file encoding. Auto-detect if not provided.',
            type: 'string',
        })
        .option('r', {
            alias: 'replace',
            describe:
                'Translate the input file and replace it. Will ignore --out argument',
            type: 'boolean',
        }).argv;

    if (!(converters as string[]).includes(args.c)) {
        throw new Error(
            `Unknown converter "${
                args.c
            }". It should be one of:\n  [${converters.join(', ')}]`,
        );
    }

    const cwd = process.cwd();

    const outPath = args.o ? path.resolve(cwd, args.o) : null;

    const inFiles = args._;
    const entries = await fg(inFiles.map((inFile) => `${inFile}`));

    if (entries.length === 0) {
        if (inFiles.length > 0) {
            throw new Error('Files do not exist.');
        } else {
            yargs.showHelp('log');
            return;
        }
    }

    if (args.e && !iconv.encodingExists(args.e)) {
        throw new Error(`Unknown encoding "${args.e}".`);
    }

    const fanHuaJi = new FanHuaJi();

    console.log('Going to convert these files:', entries.join(', '));

    for (const entry of entries) {
        await convertFile({
            fanHuaJi,
            inPath: path.resolve(cwd, entry),
            outPath: outPath ?? path.dirname(entry),
            converter: args.c as Converter,
            inEncoding: args.e,
            shouldReplace: args.r ?? false,
        });
    }

    console.log('Conversion done!');
}

main()
    .then(() => process.exit())
    .catch((error: Error) => {
        console.error(error.message);
        console.error();
        process.exit(1);
    });
