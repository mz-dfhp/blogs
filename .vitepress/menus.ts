export default [
  {
    text: "前端",
    collapsed: false,
    items: [
      { text: "HTML", link: "/page/client/html/" },
      { text: "CSS", link: "/page/client/css/" },
      { text: "JavaScript", link: "/page/client/javaScript/" },
      { text: "TypeScript", link: "/page/client/typeScript/" },
      { text: "Vue", link: "/page/client/vue/" },
      { text: "React", link: "/page/client/react/" },
      { text: "Webpack", link: "/page/client/webpack/" },
      { text: "Vite", link: "/page/client/vite/" },
    ],
  },
  {
    text: "服务端",
    collapsed: false,
    items: [
      {
        text: "node",
        items: [
          { text: "express", link: "/page/service/node/express/" },
          { text: "nest", link: "/page/service/node/nest/" },
        ],
      },
    ],
  },
  {
    text: "源码",
    collapsed: false,
    items: [
      { text: "Vue2", link: "/page/code/vue2/" },
      { text: "VueRouter", link: "/page/code/vueRouter/" },
      { text: "Vuex", link: "/page/code/vuex/" },
      { text: "Vue3", link: "/page/code/vue3/" },
      { text: "Pinia", link: "/page/code/pinia/" },
    ],
  },
  {
    text: "其他",
    collapsed: false,
    items: [
      { text: "git", link: "/page/other/git/" },
      {
        text: "算法",
        collapsed: false,
        items: [
          { text: "常见", link: "/page/other/algorithm/common" },
          { text: "leetcode", link: "/page/other/algorithm/leetcode" },
        ],
      },
    ],
  },
];
