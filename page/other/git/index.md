---
outline: deep
---

# git

## commit 相关
### git取消上次commit到暂存区

```
git reset HEAD^

--soft
不删除工作空间的改动代码 ，撤销commit，不撤销add

--hard
删除工作空间的改动代码，撤销commit且撤销add

HEAD^ 表示上一个版本，即上一次的commit，几个^代表几次提交，如果回滚两次就是HEAD^^。
也可以写成HEAD~1，如果进行两次的commit，想要都撤回，可以使用HEAD~2。
```

### git 修改commit信息

```
git commit --amend 
进入vim编辑模式 i(输入) esc(退出编辑) :eq(保存)
```