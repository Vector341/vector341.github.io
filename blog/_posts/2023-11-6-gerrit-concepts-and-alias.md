---
title: Gerrit 文档学习与推送简写
date: 2023-11-6
category: git
---

# Gerrit 文档

本帖记录学习 [Gerrit](https://gerrit-documentation.storage.googleapis.com/Documentation/3.11.2/index.html) 官方文档的记录

### 与 Github 的差异

[Basic Gerrit Walkthrough — For GitHub Users](<(http://review.tp-link.net/gerrit/Documentation/intro-gerrit-walkthrough-github.html)>) 这篇文章中介绍了 Gerrit 与 Github 在评审流程上的差异。最核心的差异是：一个特性的 Review/迭代在单个提交而不是一条分支上；使用 `git push origin HEAD:refs/for/master` 开始评审代码而不是 pull request.

## Concepts

### [The refs/for Namespace](http://review.tp-link.net/gerrit/Documentation/concept-refs-for-namespace.html)

使用 gerrit 时，每次 push 时都需要在分支前加上 `refs/for`，例如：

```sh
git push origin HEAD:refs/for/master
```

`refs/for/` 代表 "Pushing **for** Review" 的概念，Gerrit 利用这个前缀区分直接提交入库的代码和提交评审的代码。

针对每一个推到 `refs/for/` 分支的提交，Gerrit 都会自动在 `refs/changes/`下创建一个新的 ref。 ref 命名的规则如下：

```
refs/changes/[CD]/[ABCD]/[EF]
```

Where:

- [CD] is the last two digits of the **change number**
- [ABCD] is the **change number**
- [EF] is the patch set number

上面的 change number 是 URL 中结尾的一串数字，即 http://review.tp-link.net/gerrit/c/pon/sdk/econet/turnkey_sdk/apps/private/webPage/+/1248263 中的 _1248263_

当点击 “Download Patch” 时下载时，可以看见

```shell
git fetch ssh://zhuyifei@review.tp-link.net:29418/pon/sdk/econet/turnkey_sdk/apps/private/webPage refs/changes/63/1248263/9
```

其中的 `refs/changes/63/1248263/9` 代表这是 1248263 提交的第 9 个 patch

# Gerrit 推送评审的快捷命令

项目开发中使用 Gerrit 托管 git 服务。在 Gerrit 的规则下，个人是无法直接向远端分支推送提交的，所有的提交都要先推送到前缀为 `refs/for` 的分支，这表示当前代码正在评审，评审通过后才会被正式入库进入远端分支。因此，推送评审时的命令与直接推送的命令相比会繁琐很多：

```sh
# 直接推送
git push

# 推送评审
git push origin HEAD:refs/for/master
```

当仓库路径很深或分支名称很长时，这个问题会更加棘手，每次推送时，都需要输入：

```sh
git push origin HEAD:refs/for/projectname/sandbox/zhangsan/develop
```

## 解决方法

这个问题的本质原因是本地分支和远端分支的名称不相匹配，push 时 git 无法根据本地分支名找到对应的远端分支，因此提交时需要键入整个分支名来指明 push 的目的路径。

### 方案一：修改 Refspec

既然知道了原因，最直接的解决方案就是修改 [Refspec](https://git-scm.com/book/en/v2/Git-Internals-The-Refspec). 文档中也给出了一个例子：

> If the QA team wants to push their `master` branch to `qa/master` on the remote server, they can run:
>
> ```console
> $ git push origin master:refs/heads/qa/master
> ```
>
> If they want Git to do that automatically each time they run `git push origin`, they can add a `push` value to their config file:
>
> ```ini
> [remote "origin"]
> 	url = https://github.com/schacon/simplegit-progit
> 	fetch = +refs/heads/*:refs/remotes/origin/*
> 	push = refs/heads/master:refs/heads/qa/master
> ```
>
> Again, this will cause a `git push origin` to push the local `master` branch to the remote `qa/master` branch by default.

同理可得，要将评审分支推到 refs/for 只同样修改 config 文件：

```ini
[remote "origin"]
	url = https://github.com/test-git
	fetch = +refs/heads/*:refs/remotes/origin/*
	push = sandbox/zhangsan:refs/for/sandbox/zhangsan
```

与例子中唯一的不同就是省略了 `refs/heads`，git 会缺省地在 heads 的分支中寻找分支名。

### 方案二： 使用 alias 缩写

上面的方法虽然直接，但还是存在一定的局限性。显然，分支名称被硬编码到 config 中，切换分支后还需要重新配置。此外，该配置的作用域是单个项目，新建项目也需要重新配置。

重新观察最初的命令：

```sh
git push origin HEAD:refs/for/projectname/sandbox/zhangsan/develop
```

其中前半部分是固定的 `git push origin HEAD:refs/for/` ，后半部分则是当前工作的分支名 `projectname/sandbox/zhangsan/develop`. 因此我们可以将前半部分写入 [aliases](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases) 中缩写：

```ini
[alias]
	re = "!f(){ git push origin HEAD:refs/for/$1; }; f"
```

其中 `!` 表示该命令是 shell 脚本而不是 git 的子命令，应在 shell 中直接执行。`f(){ git push origin HEAD:refs/for/$1; }` 定义了函数 f，$1 表示传入的第一个参数，末尾的 f 则表示执行构造的函数。

使用时只需要输入缩写+分支名即可：

```sh
git re sandbox/develop
```

尽管缩写了前半部分，执行这个 alias 仍然需要输入分支名。我们还可以用其他方法自动读取分支名并执行：

```ini
[alias]
	re = "!git push origin HEAD:refs/for/$(git branch --show-current)"
```

其中 `$()` 的作用是将括号内语句的执行结果作为字符串再次执行。关于括号的解释如下：

> [bash - What does $(command) & do? - Ask Ubuntu](https://askubuntu.com/questions/833833/what-does-command-do#:~:text=The dollar sign before the thing in parenthesis,getting the value of that variable for something.)
>
> ## Parenthesis `()` - Command substitution
>
> Command substitution allows the output of a command to replace the command itself. Command substitution occurs when a command is enclosed as follows:
>
> ```
> $(command)
> ```
>
> or
>
> ```
> `command`
> ```
>
> Bash performs the expansion by executing the command in a subshell environment and replacing the command substitution with the standard output of the command, with any trailing newlines deleted. Embedded newlines are not deleted, but they may be removed during word splitting. The command substitution `$(cat file)` can be replaced by the equivalent but faster `$(< file)`.

使用新的缩写可以省略掉分支名直接调用

```sh
git re
```

### 方法三 第三方工具

Gerrit 作为一个成熟的托管服务，自然有很多工具适配它的工作流程，其中比较常用的有

- [git-review — git-review documentation (opendev.org)](https://docs.opendev.org/opendev/git-review/latest/index.html) —— Gerrit 评审工具
- [Gerrit- Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=SanderRonde.vscode--gerrit) —— VSCode 的 Gerit 插件

下面简要说明 git-review 的配置方法

使用 git-review 前需要在项目根目录下建立 `.gitreview` 文件说明 Gerrit 服务器的位置和工作的项目、分支。一个典型的配置文件如下：

```ini
[gerrit]
host=gerrit.com
port=29418
project=projectname/sandbox/
defaultbranch=zhangsan/develop
```

设置完成后直接在项目下执行

```sh
git review
```

即可提交评审
