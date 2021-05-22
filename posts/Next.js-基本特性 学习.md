---
title: 'Next.js-基本特性 学习'
date: '2021-05-18'
---

# 预渲染

- 两种: 一种是在打包时, 生成 HTML 模板, 然后在每次请求时, 重用模板. 另一种是在每次请求时都生成新的 HTML 文件. 第一种比较推荐!!!

- 需要获取数据的静态生成有两种. 一种是**内容**需要外部数据, 我们使用 `getStaticProps` 一种是**路径**取决于外部数据, 我们使用 `getStaticPaths`.

- getStaticProps 在构建时执行, 拿到数据, 生成 HTML 页面.
- 在构建时, 先根据 `getStaticPaths` 生成对应的 [id].js 文件, 然后 `getStaticProps` 根据 params.id 来获取 detail 数据, 最终生成页面.

![static_generate](/images/static_generate.png)

- 什么使用我们该使用静态生成呢?
  问自己: 在用户请求之前, 我可以提前准备好这些页面么? 如果是, 我们就应该用静态生成!!!

- 周所周知的 SSR 是每次请求都生成新的 HTML, 速度必须是慢!

# 获取数据

- 在 `getStaticProps`方法中, 我们可以直接写服务端的代码.

- 自增静态生成, 需要将 revalidate 设置为 1, 这样当请求来临时, 在一秒的时间内最多生成新的页面一次, 这样可以做实时列表!!!

- 相比于传统的 SSR, ISR 能有让网页加载更快, 不离线, 更新不成功就显示旧的.

- 使用 `process.cwd()`读取文件. 相当于根目录.

- 无法接收 query_params 或者 HTTP Headers 参数.

- next/link 或者 next/router 会生成一个 JSON 文件, 这个 JSON 文件是客户端 router 的结构描述文件, 所以客户端之间的页面跳转是不会执行`getStaicProps`.

- **getStaticPaths 中的 fallback, 如果为 false, 如果生成失败会报 404. 如果为真, 会悄悄的再试一遍. 我们最好是用 Fallback, 比如做个 loading 页面. fallback 为真应该是生成环境的常态, 因为生产环境中, 我们不可能把所有的 ID 交给 getStaticPaths, 而且总会有新的 id 生成.**

- fallback: blocking 相当于 SSR, 不常用.

- 客户端渲染我们可以使用 SWR

```shell
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetch)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

# CSS 样式

- 在 `_app.js` 中引用全局样式

- 从 `node_modules` 中导入...个人觉得不常用...

- 组件级别的我们可以使用 Sass 模块化, 我们一般选择 `scss`文件名.

# Image 组件和图片优化

- 有很的优化...最好使用

# 环境变量

- 使用 `.env.local` 来控制

```shell
// pages/index.js
export async function getStaticProps() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

- 默认加载的变量只会在 node.js 环境中, 如果想暴露到浏览器则必须加: `NEXT_PUBLIC_` 前缀. 这是我们一般这么用的.

# Routing 路由

-
