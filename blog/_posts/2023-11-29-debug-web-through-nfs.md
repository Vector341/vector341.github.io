---
title: 嵌入式开发调试方法
date: 2023-11-29
category: debug
---

## 背景

> 嵌入式开发中，相对普通上层软件开发，每次新编译出一个版本的软件，都要很麻烦地烧录到对应的存储介质，比如 Nor Flash 上，然后给开发板上电，继续开始调试开发，而不能像开发上层 PC 端软件，在 IDE 中，编译一下，点击运行，即可看到最新结果。
>
> 所以，嵌入式开发中，开发的效率显得很低，其中一个方法，可以先对避开此问题，避免每次都要重新烧写新编译的程序的问题，那就是，对于新版本的 kernel 和 rootfs，分别通过 tftp 或 NFS 挂在 kernel，通过 NFS 挂在 rootfs，的方式，重新编译一个新版本的 kernel 或者是 rootfs 时，每次都不用重新烧写，只需要把对应的文件，放到对应的 tftp 或者 NFS 的文件夹下面即可。

本文介绍通过 nfs 挂载工程文件夹的方式，实现高效率的嵌入式页面开发

## NFS 服务器

PC 端需要配置 NFS 服务器对外暴露本地的代码文件，供嵌入式设备访问。搭建服务器的方法可分为 Linux 环境与 Windows 环境。

### Linux 下配置 NFS 服务

以 Ubuntu 为例，配置的方法可参考以下两篇文章：

[How To Set Up an NFS Mount on Ubuntu 20.04 | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nfs-mount-on-ubuntu-20-04)

[Network File System (NFS) | Ubuntu](https://ubuntu.com/server/docs/service-nfs)

**安装服务器工具**

```sh
sudo apt install nfs-kernel-server
```

**启动服务**

```
sudo systemctl start nfs-kernel-server.service
```

**配置共享文件**

编辑 `etc/exports`，配置文件的格式为：

```
directory_to_share    client(share_option1,...,share_optionN)
```

这里我们将源代码文件夹共享给所有客户端

```
project/PON/webPage/Router/e8c_joyme4_utf8/boaroot *(rw,async,no_subtree_check,no_root_squash)
```

括号内是配置选项

**应用配置**

```
sudo exportfs -a
```

### Windows 下配置 NFS 服务

由于 Windows 缺少对 NFS 的支持，因此需要通过第三方软件搭建 NFS 服务，这里以 [FreeNFS](<[freenfs.sourceforge.net](https://freenfs.sourceforge.net/)>) 为例。

安装后在右键托盘的图标，点击 Setting 打开设置，在 Server tab 的 Path 中填入工程路径即可。

#### 通过 WSL2 配置

升级至 WSL2 [windows subsystem for linux - wsl2 mounting nfs mount.nfs: No such device - Ask Ubuntu](https://askubuntu.com/questions/1316629/wsl2-mounting-nfs-mount-nfs-no-such-device)

## NFS 客户端

**NFS 的挂载**

样机即 NFS 的客户端，在样机上仅需要将工程对应文件挂载到需要使用的路径下即可:

```
mount -t nfs -o nolock 192.168.1.100:/ /boaroot
```

其中 192.168.1.2 是 NFS 服务器的 IP 地址，在我们的调试模式下即 PC 的 IP 地址。

注意需要加上 `-o nolock` 选项，否则会出现 [svc: failed to register lockdv1 RPC service (errno 111)解决和 nfs 配置\_nfs 保错 111-CSDN 博客](https://blog.csdn.net/yihui8/article/details/43702603)

现在，所有在 PC 上所有的文件修改都会直接体现在开发板上，使用 git 切换分支后也能直接在样机上观察到页面的变化。

**遗留问题**

1.  FreeNFS 的 Clients 设置建议加入样机 IP，如 `192.168.1.1 192.168.1.2` 等
2.  PON 部分源文件在打包的时候会被重命名，举个例子，高级配置》语音功能设置，切换成 H.248 协议，会报 404。不改涉及相关文件的话影响不大
3.  CGI 文件会报 502 Error，例子：高级配置》DDNS 页面。推测是因为：1. 换行符被强制转换的问题？2. chmod 问题？ 不改涉及相关文件的话影响不大
4.  文档中的 `mount -t nfs -o nolock 192.168.1.2:/ /boaroot` ，建议说明这个 IP 表示 NFS Server 的 IP（在这个情况下就是电脑 IP）
5.  建议提供样机进行 unmount 的方法
6.  在 NFS Server 挂掉的情况下，比如 Windows FreeNFS 强制 Quit，样机的串口输入 `ls` 指令无响应。建议说明在关闭 Server 前一定要 unmount。再次启动 NFS Server ，串口可用。

使用 mount 命令查看 NFS 是否挂载成功：

```
# mount

...
192.168.1.2:/ on /boaroot type nfs (rw,relatime,vers=3,rsize=32768,wsize=32768,namlen=255,hard,nolock,proto=tcp,timeo=600,retrans=2,sec=sys,mountaddr=192.168.1.2,mountvers=3,mountproto=tcp,local_lock=all,addr=192.168.1.2)

```

最后一行表明 192.168.1.2 上的 NFS 已被挂载至 boaroot

**NFS 的卸载**

使用 umount 可以卸载 NFS, 注意卸载前需要退出挂载的文件目录，最简单的方法是返回根目录：

```
cd /
umount /boaroot
```

## NFS 选项

缓存相关

ac/noac

## NFS 文件执行权限的问题

从 Linux 上通过 NFS 挂载 Windows 下的文件时，会出现执行权限的问题。这个问题分两步，一个是 NFS 对文件权限的映射，一个是 Windows 到 Linux 下对文件权限的映射。
