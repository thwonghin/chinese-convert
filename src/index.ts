import path from 'path';
import yargs from 'yargs';

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
        .argv;

    if (!(converters as string[]).includes(args.c)) {
        throw new Error(`Converter ${args.c} is unknown. It should be one of:\n  [${converters.join(', ')}]`);
    }

    if (!await isFilePathExist(path.normalize(args.i))) {
        throw new Error(`File ${args.i} does not exist.`);
    }

    await convertFile({
        inPath: path.normalize(args.i),
        outPath: path.normalize(args.o),
        converter: args.c as Converter,
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
