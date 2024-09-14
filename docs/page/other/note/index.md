# 随心记

#### ssh
生成密钥
```bash
ssh-keygen -t rsa -b 4096
```

添加密钥到服务器
```bash
ssh-copy-id user@server_ip
```
启动 ssh-agent 并添加密钥
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```