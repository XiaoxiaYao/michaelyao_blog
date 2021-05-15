---
title: 'Django REST framework API Views 学习'
date: '2021-05-13'
---

# APIView

APIView 是最基础的 View, 其实相当于 NodeJS 很多框架中的 Controller.
我们可以这样返回所有的用户. 但是之后我们会发现这样做比较繁琐, 大多数时候我们会使用它的各种子类来更加快速的实现我们的需求. 但是如果 Generic views 无法满足自定义的需求,可以降级选择 APIView 这种较为底层的类开发.

```shell
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth.models import User

class ListUsers(APIView):
    """
    View to list all users in the system.

    * Requires token authentication.
    * Only admin users are able to access this view.
    """
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        usernames = [user.username for user in User.objects.all()]
        return Response(usernames)
```

# GenericAPIView

Generic view 是我们使用最多, 因为这些 view 将我们开发中的日常需求进行整理, 非常有利于快速开发功能, **mini 脚手架**.

比如对比上面的 APIView, 如果我们使用 ListAPIView. 代码会少很多, 只需要指定 queryset,告诉返回哪些数据, 通过 serializer_class 告诉用哪个序列化类对其进行序列化即可:

```shell
from django.contrib.auth.models import User
from myapp.serializers import UserSerializer
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
```

**属性**

我们可以通过一下属性对其进行设定:

- `queryset` 指定返回什么样数据,可以直接指定, 也可以重写 `get_queryset()` 来确定要返回的数据. **当我们在重写 view 的方法,一定使用 `get_queryset()` 来获取最新的数据集`**

- `serializer_class` 我们在这个类中进行数据验证, 反序列化输入值为对象, 或者将对象序列化为 json. 我们也可以通过`get_serializer_class()`进行设定.

- `lookup_field` 以什么来进行单个对象的查询, 默认是'pk'

- `pagination_class` 如何进行批量获取数据

**方法**

- `get_queryset(self)` 自定义返回数据集, 比如 filter 一下只属于用户的 posts

```shell
def get_queryset(self):
    user = self.request.user
    return Posts.objects.filter(author=user)
```

- `get_object(self)` 自定义详情查询

- `filter_queryset(self,queryset)` 可以用来自定义筛选返回的数据集

- `get_serializer_class(self)` 可以用来针对不同的操作返回不同的序列化器

- `perform_create(self, serializer)`可以用来重写创建一个对象, 并抛出错误, 比如

```shell
def perform_create(self, serializer):
    queryset = SignupRequest.objects.filter(user=self.request.user)
    if queryset.exists():
        raise ValidationError('您已经注册过了!')
    serializer.save(user=self.request.user)
```

- `perform_update(self, serializer)`可以用来重写更新一个对象

# Mixins

Mixins 可以通过 action 方法来重写.

# ViewSets

- `ViewSet`可以将 CRUD 的相关操作都集中在一个类中, 我们只需要指定一次 queryset 即可

- `ViewSet`长远来看更加易于维护

- 除了常见的 action,我们还可以加入额外的 action, 比如给用户设定密码:

```shell
@action(detail=True, methods=['post'])
    def set_password(self, request, pk=None):
        user = self.get_object()
        serializer = PasswordSerializer(data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({'status': 'password set'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
```

这样会有一个这样的 URL 和它对应: `^users/{pk}/set_password/$`

- 我们比较常用的是可以自定义 GenericViewSet + 各种 Mixin.

```shell
from rest_framework import mixins

class CreateListRetrieveViewSet(mixins.CreateModelMixin,
                                mixins.ListModelMixin,
                                mixins.RetrieveModelMixin,
                                viewsets.GenericViewSet):
    """
    A viewset that provides `retrieve`, `create`, and `list` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.
    """
    pass
```
