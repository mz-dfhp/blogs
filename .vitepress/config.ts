import { defineConfig } from "vitepress";
import menus from './menus'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "mz-dfhp",
  description: "blogs",
  base: process.env.base || "/",
  lang: 'zh-CN',
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    logo: "/logo.jpg",
    search: {
      provider: "local",
    },

    nav: [
      { text: "首页", link: "/" },
      ...menus,
    ],

    sidebar: [...menus],

    socialLinks: [{ icon: "github", link: "https://github.com/mz-dfhp/blogs" }],
  },
});
