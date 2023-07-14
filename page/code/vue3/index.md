---
outline: deep
---

## vue3(@3.3.4)
### 起步
```bash
git clone https://github.com/vuejs/core.git 
cd ./core
pnnp install
```

可以看到 Vue.js 3.0 的源码仓库使用了 pnpm Monorepo 结构来管理多个相关项目，包括核心库、编译器、测试工具等。这种架构模式允许不同项目共享依赖项


packages 目录：包含了 Vue 的核心代码、编译器、运行时库等关键包。

- @vue/compiler-core            编译器核心库，包含了编译器的基本功能，如将模板编译为渲染函数的功能
- @vue/compiler-dom             浏览器编译器，通过该包可以将模板编译为浏览器可运行的渲染函数
- @vue/compiler-sfc             编译以 .vue 扩展名结尾的单文件组件
- @vue/compiler-ssr             用于在服务端渲染中编译和处理Vue组件
- @vue/dts-test                 测试 TypeScript 类型定义文件（.d.ts）的工具
- @vue/reactivity               响应式系统的实现 实现数据响应式变化、依赖收集和触发更新的功能
- @vue/reactivity-transform     转换工具，它可以将旧版本的 Vue2 代码迁移到 Vue3的响应式系统中 兼容
- @vue/runtime-core             用于在浏览器环境中处理虚拟 DOM、组件渲染和更新以及交互行为
- @vue/runtime-dom              运行时核心库之一，用于在浏览器环境中处理虚拟 DOM、组件渲染和更新等任务
- @vue/shared                   共享的工具函数

### 实现 reactivity

#### reactive