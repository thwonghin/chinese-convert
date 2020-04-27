# Chinese Convert CLI

Command line interface to convert between Chinese text.

本程式使用了[繁化姬 (Fanhuaji)](https://zhconvert.org/) 的 API 服務。

## Usage

```sh
yarn
yarn start --help

Options:
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  -i, --in         Input file path                           [string] [required]
  -o, --out        Output file path                          [string] [required]
  -c, --converter  Fanhuaji converter name                   [string] [required]
  -e, --encoding   Input file encoding. Auto-detect if not provided.    [string]
```

## TODO

- Build binaries with CI
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
