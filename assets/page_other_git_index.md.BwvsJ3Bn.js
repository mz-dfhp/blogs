import{_ as i,c as a,a2 as t,o as n}from"./chunks/framework.DFVTIhXe.js";const c=JSON.parse('{"title":"git","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"page/other/git/index.md","filePath":"page/other/git/index.md"}'),e={name:"page/other/git/index.md"};function h(l,s,p,k,d,r){return n(),a("div",null,s[0]||(s[0]=[t(`<h1 id="git" tabindex="-1">git <a class="header-anchor" href="#git" aria-label="Permalink to &quot;git&quot;">​</a></h1><h2 id="commit-相关" tabindex="-1">commit 相关 <a class="header-anchor" href="#commit-相关" aria-label="Permalink to &quot;commit 相关&quot;">​</a></h2><h3 id="git取消上次commit到暂存区" tabindex="-1">git取消上次commit到暂存区 <a class="header-anchor" href="#git取消上次commit到暂存区" aria-label="Permalink to &quot;git取消上次commit到暂存区&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reset</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> HEAD^</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">--soft</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">不删除工作空间的改动代码</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ，撤销commit，不撤销add</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">--hard</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">删除工作空间的改动代码，撤销commit且撤销add</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HEAD^</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 表示上一个版本，即上一次的commit，几个^代表几次提交，如果回滚两次就是HEAD^^。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">也可以写成HEAD~1，如果进行两次的commit，想要都撤回，可以使用HEAD~2。</span></span></code></pre></div><h3 id="git-修改commit信息" tabindex="-1">git 修改commit信息 <a class="header-anchor" href="#git-修改commit信息" aria-label="Permalink to &quot;git 修改commit信息&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --amend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">进入vim编辑模式</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> i</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">输入</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">esc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">退出编辑</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:wq</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">保存</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><h3 id="两个提交-commits-合并成一个" tabindex="-1">两个提交（commits）合并成一个 <a class="header-anchor" href="#两个提交-commits-合并成一个" aria-label="Permalink to &quot;两个提交（commits）合并成一个&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reset</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --soft</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> HEAD~1</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --amend</span></span></code></pre></div>`,8)]))}const g=i(e,[["render",h]]);export{c as __pageData,g as default};