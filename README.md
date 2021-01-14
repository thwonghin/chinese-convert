# Chinese Convert

![Test](https://github.com/thwonghin/chinese-convert/workflows/Test/badge.svg)

Command line interface to convert between Chinese text.

本程式使用了[繁化姬 (Fanhuaji)](https://zhconvert.org/) 的 API 服務。

## Example

```bash
# Install globally
npm install -g chinese-convert-cli

# Convert all "in/*.txt" files to Hong Kong Chinese and output to "out" folder
chinese-convert -o out -c Hongkong in/*.txt

# Convert "in1/1.txt" and "in2/2.txt" files to Taiwan Chinese and output in the input file's folder named as `*-new.txt`
chinese-convert -c Taiwan in1/1.txt in2/2.txt
```

Read more usage with `--help`.

## Development

### Prerequisite

- \>= Node v14 (or `nvm install`)
- This project uses `yarn` as dependency management tool

### Run

```bash
# Install dependencies
yarn

# Run this project
yarn start
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
