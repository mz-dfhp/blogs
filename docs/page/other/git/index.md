---
outline: deep
---

# git

## commit 相关
### git取消上次commit到暂存区

```bash
git reset HEAD^

--soft
不删除工作空间的改动代码 ，撤销commit，不撤销add

--hard
删除工作空间的改动代码，撤销commit且撤销add

HEAD^ 表示上一个版本，即上一次的commit，几个^代表几次提交，如果回滚两次就是HEAD^^。
也可以写成HEAD~1，如果进行两次的commit，想要都撤回，可以使用HEAD~2。
```

### git 修改commit信息

```bash
git commit --amend 
进入vim编辑模式 i(输入) esc(退出编辑) :wq(保存)
```

### 两个提交（commits）合并成一个

```bash
git reset --soft HEAD~1
git commit --amend
```


### git 修改所有 commit 用户信息
```bash
git filter-branch --env-filter '
OLD_EMAIL="你的旧邮箱"
CORRECT_NAME="你的正确用户名"
CORRECT_EMAIL="你的正确邮箱"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```