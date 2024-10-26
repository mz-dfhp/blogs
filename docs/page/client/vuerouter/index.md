---
outline: deep
---

# Vue Router(v4 @4.2.2)

## 开始


### Vue Router 解决了什么

- SPA（单页应用）路由管理：通过前端路由管理可以实现在不刷新页面的情况下进行页面切换，使得用户体验更加流畅。

- 前端路由规则定义和管理：提供了一种简洁灵活的方式来定义和管理前端路由规则，并且能够自动解析 URL，匹配合适的路由配置。

- 路由导航控制：提供了导航守卫的功能，可以在路由跳转前后执行一些逻辑，例如验证用户权限、加载数据等。

- 路由参数传递和管理：提供了方便的路由参数传递和管理机制，可以在路由跳转时携带参数，并且支持动态的参数匹配和响应式的参数更新。

### Vue Router 两种模式 原理

- Hash 模式

- HTML5 模式

#### Hash 模式
- onhashchange 会监听 location.hash 改变 从而进行导航处理

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>hash</title>
  </head>
  <body>
    <div>
      <div>点击切换页面</div>
      <button id="home">/home</button>
      <button id="about">/about</button>
      <div id="content"></div>
    </div>
    <script>
      const homeEl = document.querySelector("#home");
      const aboutEl = document.querySelector("#about");
      const contenEl = document.querySelector("#content");

      homeEl.onclick = function () {
        location.hash = "/home";
      };
      aboutEl.onclick = function () {
        location.hash = "/about";
      };

      function onHashChange() {
        contenEl.innerText = `我是页面 ${location.hash}`;
      }

      window.addEventListener("hashchange", onHashChange);

      if (location.hash) {
        onHashChange();
      }
    </script>
  </body>
</html>
```

#### HTML5 模式

- onpopstate 会监听 history.back() history.forward() history.go()方法进行导航
- onpopstate 不会监听 history.pushState() history.replaceState() 需要 通过 dispatchEvent 手动触发popstate事件 

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTML5 history</title>
  </head>
  <body>
    <div>
      <div>点击切换页面</div>
      <button id="home">/home</button>
      <button id="about">/about</button>
      <div id="content"></div>
    </div>
    <script>
      const homeEl = document.querySelector("#home");
      const aboutEl = document.querySelector("#about");
      const contenEl = document.querySelector("#content");

      let originalPushState = history.pushState;

      history.pushState = function () {
        const result = originalPushState.apply(this, arguments);
        const pushStateEvent = new Event("popstate");
        window.dispatchEvent(pushStateEvent);
        return result;
      };

      homeEl.onclick = function () {
        history.pushState(null, "", "/home");
      };

      aboutEl.onclick = function () {
        history.pushState(null, "", "/about");
      };

      function onHistoryChange() {
        contenEl.innerText = `我是页面 ${location.pathname}`;
      }
      // history.pushState() history.replaceState() 并不会触发 popstate 事件
      window.addEventListener("popstate", onHistoryChange);

      onHistoryChange();
    </script>
  </body>
</html>
