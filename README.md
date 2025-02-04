# dict-downloader
## about
SKK辞書をダウンロードするプラグイン

## usage
以下のグローバル変数を設定する

- `g:dict_downloader_dicts` : 配列形式で辞書のURLを指定する
- `g:dict_downloader_save_path` : 辞書のダウンロード先を指定する

`DictDownload` を実行する

## example
dpp.vimでの例

```toml
[[plugins]]
repo = 'kei-s16/dict-downloader'
hook_add = '''
  let g:dict_downloader_save_path = "~/.skk"
  let g:dict_downloader_dicts = [
    \   "https://skk-dev.github.io/dict/SKK-JISYO.L.gz",
    \   "https://raw.githubusercontent.com/kei-s16/skkdicts/refs/heads/main/SKK-JISYO.mtg",
    \ ]
'''
```

