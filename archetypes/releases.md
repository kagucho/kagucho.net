---
# 部員の個人リリース用のひな形。
#   hugo new releases/ファイル名.md
# で、このひな形からファイルが作られます。
title: "作品名をここに"
group: "member"            # "member" = 部員の個人リリース / "kgc" = KGC シリーズ
artist: "名義をここに"
year: "{{ now.Format "2006" }}"
link: ""                   # 聴ける場所の URL。SoundCloud なら再生プレイヤーが自動で付きます
linkLabel: "SoundCloud"    # ボタンの文字。空欄なら「聴く」
cover: ""                  # ジャケット画像。static/img/releases/ に置いて "img/releases/xxx.jpg"
weight: 50                 # 数が小さいほど上に並ぶ
draft: true                # 公開してよくなったら false に変える
---
