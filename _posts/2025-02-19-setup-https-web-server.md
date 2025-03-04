---
layout: post
title: 搭建支持 HTTPS 的网站
category: DIY
---

在运行 Ubuntu 的云主机上搭建一个网站并完成 HTTPS 签名

### 准备工作

- 一台拥有公网 IP 的云主机。（这里以 Amazon EC2 为例）
- 一个域名（配置解析到上面的公网 IP）



## 正式开始

### 搭建 web 服务器

想要获取证书完成签名流程，首先需要一个正常工作的 web 服务器。使用 Apache 默认配置即可

### 获取证书

[LetsEncrypt](https://letsencrypt.org/) 提供免费的 SSL 证书，它借助 ACME 协议完成域名签名。支持 ACME 的客户端有很多，这里以 

 [`acme.sh`](https://github.com/acmesh-official/acme.sh) 为例。

确保 apache 服务器正常运行，执行以下命令在 staging 环境中测试配置的正确性：

```sh
sudo acme.sh --issue --server letsencrypt --test -d vector341.com -w /var/www/html --keylength ec-256
```

执行这个命令后，服务器上的 acme agent 会首先生成一对密钥，保存私钥后将公钥发送给 Let's Encrypt 的服务器。Let's Encrypt 服务器会返回一个 nonce，agent 使用私钥签名后放入 web 服务器的根目录下。之后，Let's Encrypt 访问你提供的域名，用公钥确认 nonce 以及签名的正确性。

在 staging 环境测试完成后即可正式签名：

```sh
sudo acme.sh --issue --server letsencrypt -d vector341.com -w /var/www/html --keylength ec-256 --force

```

#### 工作原理

Let's Encrypt 使用 ACME 协议来证明一个服务器确实拥有这个域名，上述的创建资源是一种证明方法，详细的交互步骤见：https://letsencrypt.org/how-it-works/



### 安装证书

将证书、私钥和证书链安装到指定位置，在 Ubuntu 中通常是 `/etc/ssl/certs` 

```sh
acme.sh --installcert -d vector341.com --cert-file /etc/ssl/certs/letsencrypt-cert.crt --key-file /etc/ssl/private/letsencrypt-cert.key --fullchain-file /etc/apache2/ssl.crt/letsencrypt-fullchain.crt --ecc
```



### 配置 https 服务器

以 apache 的默认 ssl 配置 `/etc/apache2/site-available/default-ssl.conf` 为例，修改以下三项的配置：

```sh
        #   A self-signed (snakeoil) certificate can be created by installing
        #   the ssl-cert package. See
        #   /usr/share/doc/apache2/README.Debian.gz for more info.
        #   If both key and certificate are stored in the same file, only the
        #   SSLCertificateFile directive is needed.
        SSLCertificateFile      /etc/ssl/certs/letsencrypt-cert.crt
        SSLCertificateKeyFile   /etc/ssl/private/letsencrypt-cert.key

        #   Server Certificate Chain:
        #   Point SSLCertificateChainFile at a file containing the
        #   concatenation of PEM encoded CA certificates which form the
        #   certificate chain for the server certificate. Alternatively
        #   the referenced file can be the same as SSLCertificateFile
        #   when the CA certificates are directly appended to the server
        #   certificate for convinience.
        SSLCertificateChainFile /etc/apache2/ssl.crt/letsencrypt-fullchain.crt
```

修改配置后启用 ssl 模块和 virtual host，重启 apache2 即可：

```sh
sudo a2enmod ssl
sudo a2ensite default-ssl.conf
sudo systemctl restart apache2
```



> 其实这里也提示了可以用 ssl-cert 生成自签名的证书：
>
> ```sh
> sudo make-ssl-cert generate-default-snakeoil
> ```
>
> 生成的私钥位于：`/etc/ssl/private/ssl-cert-snakeoil.key`
> 生成的证书：`/etc/ssl/certs/ssl-cert-snakeoil.pem`





## SSL 签名与加密的原理

在密码学中，签名与加密是一对互逆的过程：

- 签名：使用私钥与原始数据运算得到签名，使用公钥验证数据完整性（integrity）
- 加密：使用公钥与原始数据运算得到密文，使用密钥确保数据私密性（encryption）

其中原始数据一般是文件的哈希值，签名时公钥常被包含在原始文件中一起签名。



### 详细过程

OpenSSL 库提供了丰富的工具，我们可以实际探究签名或加密的过程

#### 1. 生成私钥

私钥用于对数据进行签名。

```bash

openssl genpkey -algorithm RSA -out private_key.pem
```

#### 2. 提取公钥

用私钥生成公钥，用于签名验证。

```bash

openssl rsa -in private_key.pem -pubout -out public_key.pem
```

#### 3.创建示例数据文件

创建一个包含要签名数据的简单文本文件。

```bash

echo "Hello, this is a test message." > data.txt
```

#### 4.对数据文件进行签名

使用私钥创建签名。

```bash

openssl dgst -sha256 -sign private_key.pem -out signature.bin data.txt
```

参数说明：

- `-sha256`：指定哈希函数，一般签名是针对文件的哈希值

signature.bin 即是文件 data.txt 的签名

#### 5.验证签名

OpenSSL 提供了工具用于验证签名

```
openssl dgst -sha256 -verify public_key.pem -signature signature.bin data.txt
```

我们也可以参考验证的步骤手动完成上述步骤，更好地理解如何验证签名。

1. 使用相同的哈希算法（SHA-256）对原始数据文件 (`data.txt`) 进行哈希计算。
```
$ sha256sum data.txt
21dae1f57aab6196019a38338f4270afa4060461725c852a07fccf735f80c28d  data.txt
```
2. 使用**公钥**解密 `signature.bin` 以获取原始哈希值。
```
$ openssl rsautl -verify -inkey public_key.pem -pubin -in signature.bin -out decrypted.bin
```
3. 如果**两个哈希值匹配**，则数据被验证为真实且未被篡改。
```
$ tail -c 32 decrypted.bin > extracted_hash.bin
$ hexdump -C extracted_hash.bin
00000000  21 da e1 f5 7a ab 61 96  01 9a 38 33 8f 42 70 af  |!...z.a...83.Bp.|
00000010  a4 06 04 61 72 5c 85 2a  07 fc cf 73 5f 80 c2 8d  |...ar\.*...s_...|
00000020
```

RSA 签名使用的哈希结果为 32 字节，`tail -c 32` 用于去除解密数据中的 **ASN.1 Header**，提取最后 32 字节的哈希值




## 参考

1. Mozilla 的一个网站，用于生成现代的 HTTPS 配置：https://ssl-config.mozilla.org/
2. 同样是 Mozilla 的网站，用于评价 HTTPS 网站的安全性：https://developer.mozilla.org/en-US/observatory
3. SSL 证书信任链的工作原理：https://knowledge.digicert.com/solution/how-certificate-chains-work