import { defineConfig } from "vuepress/config";
export default defineConfig({
  title: "vector 的博客",
  description: "...",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      {
        text: "vector 的博客",
        items: [
          {
            text: "Github",
            link: "https://github.com/vector341",
          },
          {
            text: "掘金",
            link: "https://juejin.cn/user/",
          },
        ],
      },
    ],
    sidebar: [
      {
        title: "template",
        path: "/",
        collapsable: false,
        children: [{ title: "Test Title", path: "/" }],
      },
      {
        title: "从 ECMA 规范看 JavaScript",
        path: "/javascript/2025-03-02-this-from-ecma-spec",
        children: [
          {
            title: "ECMA-262",
            path: "/javascript/2025-03-02-this-from-ecma-spec",
          },
        ],
      },
    ],
  },
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
});
