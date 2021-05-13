---
title: 'Django REST framework API Requests 和 Responses 学习'
date: '2021-05-13'
---

# Request

DRF 的 `Request` 类基于`HttpRequest`, 并增加了请求解析和认证.

- `request.data` 可以用来获取 `POST, PUT, PATCH` 方式过来的 `body` 数据, 也包含了上传来的文件, 但是上传文件一般还是在 model 上 使用 ImageField 或者 FileField

- `request.query_params` 是最常用的方式, 通常用来获取 `GET` 方式传递过来的参数, 但是实际上任何的 HTTP 方式都可以包含 `query_params`, 不光是 `GET`.

- 如果解析客户端发来的参数错误, 会报 404. 如果发现发来的参数类型不支持, 会报 415 `Unsupported Media Type`

- 在认证方面, DRF 可以做到细到根据每个 Request 来做认证, 还支持每个认证体系认证, 在后台我们可以拿到认证后的用户信息(`request.user`)和 token 信息(`request.auth`).

# Response

`Response(data, status=None, template_name=None, headers=None, content_type=None)`

- 基本上不会使用到这个类, 偶尔会使用来返回一些特定的 Response. 但是传入的数据最好是经过序列化的, 因为 Response 无法处理复杂的数据类型, 比如 Django 的 model.

比如:

```
Response({'valid': True, 'email_address': user.email})
```
