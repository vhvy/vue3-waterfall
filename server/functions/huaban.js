const axios = require("axios");
const URL = require("url").URL;

function request(method, url, config = {}) {
  return axios[method.toLowerCase()](url, config);
}

const header_prefix_reg = /^XM-.*/;

function handleHeader(header) {
  return Object.keys(header)
    .reduce((headers, key) => {
      if (header_prefix_reg.test(key.toUpperCase())) {
        headers[key.slice(3)] = header[key];
      }
      return headers;
    }, {});
}
// 将前端传上来的自定义请求头转换为正常请求头

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
// 是否是合法url


const handler = async (event) => {

  const { httpMethod, queryStringParameters, headers } = event;

  const responseHeaders = {};

  if (headers.origin) {
    const allowHeaders = headers["access-control-request-headers"];
    // 获取要允许跨域的头

    Object.assign(responseHeaders, {
      "Access-Control-Allow-Origin": headers.origin,
      "Access-Control-Allow-Headers": allowHeaders || "*",
    });
  }
  // 需要跨域时允许跨域

  if (httpMethod.toUpperCase() === "OPTIONS") {
    return {
      statusCode: 200,
      headers: responseHeaders
    }
    // OPTIONS请求快速返回
  }

  Object.assign(responseHeaders, {
    "Content-Type": "application/json;charset=utf-8"
  });
  // 防止乱码

  const url = queryStringParameters.url;
  // 获取提交上来需要代理访问的地址

  if (!url || !isValidUrl(url)) return {
    statusCode: 404,
    body: JSON.stringify({
      message: "params error!"
    }),
    headers: responseHeaders
  }

  const requestHeader = handleHeader(headers);
  // 将前端传上来的需要代理的请求头处理为正常请求头

  try {
    const res = await request(httpMethod, url, {
      headers: requestHeader
    });
    return {
      statusCode: 200,
      body: JSON.stringify(res.data),
      headers: responseHeaders
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: error.toString(),
      headers: responseHeaders
    }
  }
}

module.exports = { handler }
