将已购买的掘金小册保存为 markdown 格式 和 pdf 格式

```javascript
 params = {
  token: 'your token',
  client_id: '******',
  src: 'web',
  uid: 'your uid'
  id: 'your id', // 小册的id
}
```

具体参数可以打开 [https://juejin.im/book/5a124b29f265da431d3c472e](https://juejin.im/book/5a124b29f265da431d3c472e)
然后 Devtool->Network->XHR 查看`get?uid=***`的请求参数
