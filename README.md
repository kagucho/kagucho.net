## これはなに
2020年夏頃までWordPressやらなんやらで動いていた局のサイトを静的サイトジェネレータ「[Hugo](https://gohugo.io/)」でサルベージしてGitHub Pagesでホストしたもの

## 手元で動かす方法
任意の方法でHugoを入手し，

```
$ git clone git@github.com:kagucho/kagucho.net.git --recursive
$ hugo server
```

## ファイル構成の解説
- `archetypes/`: よくわからん
- `content/`: `docs/index.html`の元になるmdが入っている．多分他のページも追加できる．
- `docs/`: `hugo`の出力先．GitHub Pagesのroot.
- `docs/ridaisai/`: 理大祭の作品ページ．hugoではなく手書き．別のリポジトリでありsubmoduleを使っている．
- `layouts/`: デフォルトのテーマから変更したファイル．html生成時にはこの中身が優先される．
- `static/`: 画像など
- `themes/`: テーマのsubmodule.
- `config.toml`: config

## ToDo
- [ ] 活動についての説明を現状に即す
- [ ] 作品ギャラリーのページを作る
- [ ] ActionsでCI/CD
