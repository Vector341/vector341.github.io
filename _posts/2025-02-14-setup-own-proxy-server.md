---
layout: post
title: "使用 v2ray 搭建代理服务器"
categories: tutorial, v2ray
---



### 下载

Linux 下 v2ray 有一个[下载脚本](https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/refs/heads/master/install-release.sh)，运行命令即可安装。

```
// 安裝執行檔和 .dat 資料檔
# bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
```

**该下载脚本不使用系统代理**，而是使用命令行参数传入代理服务器地址，同时支持以下参数：

> 来源：https://www.v2ray.com/chapter_00/install.html#gosh
>
> install-release.sh 支持如下参数，可在手动安装时根据实际情况调整：
>
> - `-p` 或 `--proxy`: 使用代理服务器来下载 V2Ray 的文件，格式与 curl 接受的参数一致，比如 `"socks5://127.0.0.1:1080"` 或 `"http://127.0.0.1:3128"`。
> - `-f` 或 `--force`: 强制安装。在默认情况下，如果当前系统中已有最新版本的 V2Ray，install-release.sh 会在检测之后就退出。如果需要强制重装一遍，则需要指定该参数。
> - `--version`: 指定需要安装的版本，比如 `"v1.13"`。默认值为最新版本。
> - `--local`: 使用一个本地文件进行安装。如果你已经下载了某个版本的 V2Ray，则可通过这个参数指定一个文件路径来进行安装。
>
> 示例：
>
> - 使用地址为 127.0.0.1:1080 的 SOCKS 代理下载并安装最新版本：`./install-release.sh -p socks5://127.0.0.1:1080`
> - 安装本地的 v1.13 版本：`./install-release.sh --version v1.13 --local /path/to/v2ray.zip`

使用 `--help` 查看完整使用说明。

下载后默认二进制文件、日志和 service 的位置如下：

```
installed: /usr/local/bin/v2ray
installed: /usr/local/bin/v2ctl
installed: /usr/local/share/v2ray/geoip.dat
installed: /usr/local/share/v2ray/geosite.dat
installed: /usr/local/etc/v2ray/config.json
installed: /var/log/v2ray/
installed: /var/log/v2ray/access.log
installed: /var/log/v2ray/error.log
installed: /etc/systemd/system/v2ray.service
installed: /etc/systemd/system/v2ray@.service
```



### 配置

默认配置文件位置：`/usr/local/etc/v2ray/config.json` 客户端和服务器均相同

**服务器配置**

```json
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "debug"
  },
  "inbounds": [
    {
      "port": 10086,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "uuid"	// 使用 v2ray uuid 生成的随机 uuid
          }
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

服务器需要打开上述端口10086，以 Amazon EC2 为例，需要在 security group 中新建一条 Inbound 规则

**客户端配置**

```json
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "debug"
  },
  "inbounds": [
    {
      "port": 1080, // SOCKS 代理端口，在浏览器中需配置代理并指向这个端口
      "listen": "127.0.0.1",
      "protocol": "socks",
      "settings": {
        "udp": true
      }
    },
    {
      "port": 1080, // SOCKS 代理端口，在浏览器中需配置代理并指向这个端口
      "listen": "127.0.0.1",
      "protocol": "http",
      "settings": {
        "timeout": 30
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "x.x.x.x", // 服务器地址
            "port": 10086,
            "users": [
              {
                "id": "uuid"  // 使用 v2ray uuid 生成的随机 uuid
              }
            ]
          }
        ]
      }
    },
    {
      "protocol": "freedom",
      "tag": "direct",
      "settings": {}
    }
  ],
  "routing": {
    "domainStrategy": "IPOnDemand",
    "rules": [
      {
        "type": "field",
        "ip": [
          "geoip:private"
        ],
        "outboundTag": "direct"
      }
    ]
  }
}
```

需要注意的是在没有加 TLS 的情况，地址部分必须填写节点服务器IP地址

*注：以上配置是个人参考官方配置修改而来的最简单的可用配置，同时输出了详细的日志。更多配置可参考：https://github.com/v2fly/v2ray-examples*



## 参考文档

1. v2ray 官方文档：https://www.v2fly.org/ （注意：[Project V · Project V Official](https://www.v2ray.com/en/)已过时，下载脚本和文档请参考 v2fly）
2. v2ray 下载脚本：https://github.com/v2fly/fhs-install-v2ray
3. v2ray 示例配置：https://github.com/v2fly/v2ray-examples
4. [VMess + Vultr 自建梯子新手指南 Clash V2ray VMess 配置保姆级教程 – 胖橙博客](https://jiasupanda.com/vmess-vultr)



