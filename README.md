# kagucho.net

神楽坂一丁目通信局（KGC Recordings）の公式サイトです。
このファイルは、**サイトを引き継ぐ人が最初に読む説明書**です。

---

## 1. このサイトの仕組み

文章のファイルと、見た目の型紙を、**Hugo** という道具が合体させて Web ページを作ります。

```
原稿（content / data）＋ 型紙（layouts）＋ 見た目（static）
                    ↓  Hugo
              完成品（docs フォルダ）
                    ↓  GitHub へ送る
              https://kagucho.net/ に反映
```

**文章を直したいだけなら、`content` フォルダの中のファイルを書き換えるだけです。**
型紙や見た目のファイルは触らなくて構いません。

---

## 2. 準備（最初の1回だけ）

Hugo をインストールします。Windows なら PowerShell で:

```powershell
winget install Hugo.Hugo.Extended
```

インストール後、**PowerShell を開き直してください**（PATH の反映に必要です）。

確認:

```powershell
hugo version
```

バージョンが表示されれば成功です。

> このサイトは **Hugo v0.165.0 (extended)** で動作確認しています。
> これより大幅に新しい／古いバージョンだと、エラーが出ることがあります。

---

## 3. 手元で見ながら編集する

```powershell
cd $HOME\kagucho.net
hugo server -D --noHTTPCache -M
```

表示された `http://localhost:1313/` をブラウザで開きます。

このまま起動しておけば、**ファイルを保存するたびにブラウザが自動で更新されます。**
止めるときは `Ctrl + C`。

### オプションの意味

| オプション | 意味 |
|---|---|
| `-D` | 下書き（`draft: true`）も表示する。公開前の確認用 |
| `--noHTTPCache` | ブラウザに古い内容を覚えさせない |
| `-M` | 手元用の結果を `docs` に書き込まない（**重要**。付け忘れると `docs` が壊れます） |

### 表示が変わらないとき

ブラウザで `Ctrl + Shift + R`（キャッシュを無視して再読み込み）。

### `slice bounds out of range` というエラーが出たとき

ファイルを大きく書き換えたときに、まれに Hugo が古い情報を掴んだままになります。
`Ctrl + C` で止めて、起動し直せば直ります。ファイルは壊れていません。

---

## 4. どのファイルが何か

### 触っていい（原稿）

| ファイル | 画面のどこ |
|---|---|
| `content/sections/hero.md` | 一番上の大きな領域。キャッチコピーとボタン |
| `content/sections/about.md` | ABOUT。本文と、右に並ぶ小さな箱 |
| `content/sections/join.md` | JOIN US。入部の誘いと LINE ボタン |
| `content/activities/dtm.md` | ACTIVITIES の DTM のカード |
| `content/activities/dj.md` | ACTIVITIES の DJ のカード |
| `content/releases/*.md` | RELEASES。**1作品＝1ファイル** |
| `data/year.yaml` | 一年の流れ（春夏秋冬の帯） |
| `data/links.yaml` | 一番下のリンク（X / SoundCloud / Instagram / Contact） |
| `config.toml` | サイト名、説明文、SNS アカウントなど |

### 色だけなら触っていい

`static/css/site.css` の**先頭にある `:root` の部分**。
ここの色コードを書き換えると、サイト全体の色が一斉に変わります。

```css
--green:#42DCA3;      /* サークルの色 */
--ink-900:#080B0A;    /* 背景の黒 */
```

### 触らない方がいい（仕組み）

- `layouts/` — 並べ方を決める型紙
- `static/css/site.css` の `:root` より下
- `static/js/site.js` — 画面の動き
- `docs/` — 自動生成される完成品。**手で編集しても次のビルドで消えます**

---

## 5. よくある作業

### 部員の作品を追加する

`content/releases/` に新しいファイルを作ります。既存のファイルをコピーして名前を変えるのが早いです。

```yaml
---
title: "作品名"
group: "member"          # 部員の個人リリース
artist: "名義"
year: "2026"
link: "https://soundcloud.com/..."
linkLabel: "SoundCloud"
cover: ""                # ジャケット画像。無ければ空欄
weight: 50               # 数が小さいほど上に並ぶ
draft: false             # true の間は公開されません
---
```

`link` が SoundCloud の URL なら、**再生プレイヤーが自動で埋め込まれます。**

### KGC シリーズ（コンピ）を追加する

同じ `content/releases/` に、`group: "kgc"` と書いたファイルを置きます。
1枚でも置けば「KGC シリーズ」の欄が自動で現れます。

```yaml
---
title: "KGC vol.1"
group: "kgc"
year: "2026"
event: "M3 2026春"
cover: ""
link: ""
weight: 10
tracks:                  # 収録曲。不要なら tracks ごと消してOK
  - title: "曲名"
    artist: "部員名"
    link: ""
draft: false
---
```

### ジャケット画像を入れる

1. 画像を `static/img/releases/` に置く（フォルダが無ければ作る）
2. そのファイルの `cover:` に `"img/releases/ファイル名.jpg"` と書く

### セクションを消す / 復活させる

原稿ファイルを消せば、そのセクションは画面からも左のナビからも消えます。
**ナビの番号は自動で振り直される**ので、手で直す必要はありません。

消すときはファイルを削除せず、どこかに退避しておくと後で戻せます。

### 一年の流れを直す

`data/year.yaml` を書き換えます。
`public: true` を付けた札だけ緑色になります（人が来る日、という意味）。

---

## 6. 公開する

**手元で `hugo server` を動かしているだけでは、インターネットには反映されません。**

公開は3ステップです。

```powershell
# 1. サーバーを止める（Ctrl + C）

# 2. 公開用の完成品を作り直す
hugo

# 3. 記録して送る
git add -A
git commit -m "変更内容を書く"
git push
```

`git push` の数分後に https://kagucho.net/ へ反映されます。

### 注意

- **手順2の `hugo` を忘れないでください。** これを飛ばすと、原稿だけ更新されて見た目が古いままになります。
- `hugo server` を `-M` なしで動かすと `docs` の中身が `localhost` 指定で汚れます。その状態で公開するとサイトが崩れます。汚してしまったら、`hugo` を打ち直せば正しい状態に戻ります。

---

## 7. 失敗したとき

git が全部覚えているので、いつでも戻せます。

```powershell
# 直前の記録の状態に戻す（保存していない変更は消えます）
git reset --hard HEAD

# 記録の一覧を見る
git log --oneline
```

特定の地点に戻したいときは、`git log` で番号（`03f4c0d` のような7文字）を調べて:

```powershell
git reset --hard 03f4c0d
```

---

## 8. 構成メモ

- 静的サイトジェネレータ: **Hugo v0.165.0 extended**
- テーマ: **なし**（`layouts/` の自作テンプレートで組んでいます）
- 公開: GitHub Pages（`docs/` フォルダを公開ディレクトリに設定）
- `docs/ridaisai/2021` は別リポジトリの submodule（2021年の理大祭作品ページ）

### 使っている書体

Google Fonts から読み込んでいます（`layouts/partials/head.html`）。

- Archivo — 欧文の見出し
- Zen Kaku Gothic New — 日本語
- IBM Plex Mono — ラベル・数字
