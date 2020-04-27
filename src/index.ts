import path from 'path';
import yargs from 'yargs';
import iconv from 'iconv-lite';

import { converters } from './libs/fanhuaji/index.js';
import { Converter } from './libs/fanhuaji/types.js';
import { isFilePathExist } from './utils.js';
import { convertFile } from './convert-file.js';

async function main(): Promise<void> {
    const args = yargs
        .option('i', {
            alias: 'infile',
            describe: 'Input file path',
            demand: true,
            type: 'string',
        })
        .option('o', {
            alias: 'outfile',
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
            alias: "encoding",
            describe: 'Input file encoding. Auto-detect if not provided.',
            type: 'string',
            demand: false,
        })
        .argv;

    if (!(converters as string[]).includes(args.c)) {
        throw new Error(`Unknown converter "${args.c}". It should be one of:\n  [${converters.join(', ')}]`);
    }

    if (!await isFilePathExist(path.normalize(args.i))) {
        throw new Error(`File ${args.i} does not exist.`);
    }

    if (args.e && !iconv.encodingExists(args.e)) {
        throw new Error(`Unknown encoding "${args.e}".`)
    }

    await convertFile({
        inPath: path.normalize(args.i),
        outPath: path.normalize(args.o),
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
