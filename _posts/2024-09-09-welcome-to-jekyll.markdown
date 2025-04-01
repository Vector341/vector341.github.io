---
layout: post
date: 2024-09-09 09:28:59 +0800
title: Jekyll 搭建指南
categories: jekyll update
---

## 安装

1. Install all [prerequisites](https://jekyllrb.com/docs/installation/).
   主要包括 ruby, gem 和 gcc

2. Install the jekyll and bundler

    ```
    gem install jekyll bundler
    ```

3. Create a new Jekyll site at

    ```plaintext
    ./myblog
    ```

    ```
    jekyll new myblog
    ```

4. Change into your new directory.

    ```
    cd myblog
    ```

5. Build the site and make it available on a local server.

    ```
    bundle exec jekyll serve
    ```

6. Browse to [http://localhost:4000](http://localhost:4000/)

#### Misc

##### 查看 theme 的布局详情

[minima](https://github.com/jekyll/minima) is the current default theme, and `bundle info minima` will show you where minima theme's files are stored on your computer.

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]: https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
