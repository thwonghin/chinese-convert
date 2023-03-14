# Chinese Convert

[![npm (scoped)](https://img.shields.io/npm/v/@thwonghin/chinese-convert)](https://www.npmjs.com/package/@thwonghin/chinese-convert) [![Test](https://github.com/thwonghin/chinese-convert/workflows/Test/badge.svg)](https://github.com/thwonghin/chinese-convert)

Command line interface to convert between Chinese text.

本程式使用了[繁化姬 (Fanhuaji)](https://zhconvert.org/) 的 API 服務。

## Example

```bash
# Install globally
npm install -g @thwonghin/chinese-convert

# Convert all "in/*.html" files to Hong Kong Chinese in-place
chinese-convert -r in/*.html -c Hongkong

# Convert all "in/*.txt" files to Hong Kong Chinese and output to "out" folder
chinese-convert -o out -c Hongkong in/*.txt

# Convert "in1/1.txt" and "in2/2.txt" files to Taiwan Chinese and output in the input file's folder named as `*-new.txt`
chinese-convert -c Taiwan in1/1.txt in2/2.txt
```

Read more usage with `--help`.
```
Usage: chinese-convert [file glob patterns]

Options:
  -h, --help       Show help                                           [boolean]
  -o, --out        Output file path                                     [string]
  -c, --converter  FanHuaJi converter name.
                   Supported: [Bopomofo, China, Hongkong, Mars, Pinyin,
                   Simplified, Traditional, Taiwan, WikiSimplified,
                   WikiTraditional]                          [string] [required]
  -e, --encoding   Input file encoding. Auto-detect if not provided.    [string]
  -r, --replace    Translate the input file and replace it. Will ignore --out
                   argument                                            [boolean]
  -v, --version    Show version number                                 [boolean]

Examples:
  chinese-convert -c Hongkong -o out        convert all "in/*.txt" files to Hong
  in/*.txt                                  Kong Chinese and output to "out"
                                            folder
```

## Development

### Prerequisite

- \>= Node v14
- This project uses `pnpm` as dependency management tool

### Run

```bash
# Install dependencies
pnpm i

# Run this project
pnpm start
```

## TODO

- Support custom keywords
- Support more option for Fanhuaji
- etc..

## License

### License on this project

Read [LICENSE](LICENSE) file.

### [Lincese on Fanhuaji (繁化姬)](https://docs.zhconvert.org/license/)

> - 繁化姬的後端可能會留存您所提供的文本與使用者設定，以做為改進轉換正確率的用途。
> - 繁化姬並不保證所有轉換都是正確的，並且不為轉換錯誤而造成的損失負責。 若您的文本為正式的文件，您應該在轉換後親自校閱它。
> - 繁化姬會於字幕中，加入不妨礙實際觀看效果的內容以做為推廣用途。 在「免費」使用繁化姬的情況下，我方不允許您將這些內容去除。 （商業用途請見[商業使用](https://docs.zhconvert.org/commercial/)）
