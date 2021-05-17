---
title: 'Django-REST-framework-API-Throttling, Filtering学习'
date: '2021-05-16'
---

# Throttling

- 访问频率限制, 最基本的可以在 settings.py 中设定:

```shell
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}
```

以上分别规定了匿名用户和注册用户一天能请求多少次

# Filtering

- 根据 URL 参数来 Filter

```shell
class PurchaseList(generics.ListAPIView):
    serializer_class = PurchaseSerializer

    def get_queryset(self):
        """
        This view should return a list of all the purchases for
        the user as determined by the username portion of the URL.
        """
        username = self.kwargs['username']
        return Purchase.objects.filter(purchaser__username=username)
```

- DjangoFilterBackend 可以帮助我们快速开放 filter 的条件, 如下:

```shell
class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'in_stock']
```

然后在前端的 URL 中我们可以传入 filter 的参数进行数据的筛选:
`http://example.com/api/products?category=clothing&in_stock=True`

- SearchFilter 可以用来做简单的搜索

- OrderingFilter 可以用来做排序

# Pagination

- 一般网页端只是使用 PageNumberPagination

# Versioning

- 不同的版本返回不用的 serializer:

```shell
def get_serializer_class(self):
    if self.request.version == 'v1':
        return AccountSerializerVersion1
    return AccountSerializer
```
