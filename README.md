# vue3-waterfall

[![Netlify Status](https://api.netlify.com/api/v1/badges/5dfab76c-a34a-4503-a077-68c52b128ccd/deploy-status)](https://app.netlify.com/sites/xm-waterfall/deploys)

Vue3 + netlify Functions写的一个瀑布流相册，使用了花瓣网的接口。

`/server/functions`下是netlify的函数，用来代理对花瓣网的跨域请求。

将需要的请求头加上自定义前缀，再将要请求的花瓣网API地址以参数的方式提交给函数，函数将代理此请求，解决跨域问题。

DEMO: [https://xm-waterfall.netlify.app/](https://xm-waterfall.netlify.app/)