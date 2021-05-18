---
title: 'Django REST framework API 各个类之间关系疏离 学习'
date: '2021-05-17'
---

# Seriazlier 和 ModealSeriazlier

- Seriazlier 规定了 json 的样子.
- ModealSeriazlier 只是比 Serializer 多做了两件事: 决定 fields 和简单的 create(), update()方法.

# View

- 普通的 Django view 根据 url 和 method 来确定返回什么的 json.

```shell
if request.method == 'GET':
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)
```

- DRF 的 view 类似, 但是可以指定 status code

```shell
elif request.method == 'POST':
        serializer = SnippetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

- DRF 的类 views

```shell
def post(self, request, format=None):
        serializer = SnippetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

- 使用 mixins 可以使用 mixin 中的 creat 处理 post 数据

```shell
def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
```

- 使用 ListCreateAPIView = ListMixin + GenericAPIView

```shell
class SnippetList(generics.ListCreateAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
```

- 在序列化的过程中, 如果我们想重写 create, update, destory, 我们可以重写: perform_create() 等方法
