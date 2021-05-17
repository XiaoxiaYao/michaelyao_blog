---
title: 'Django REST framework API Validators, Authenticaiton 和 Permissions学习'
date: '2021-05-15'
---

# Validators

- DRF中的参数验证全部集中在 serializers 上.


# DRF有 core Django没有的几个参数验证类:

- UniqueValidator 用来约束模型的属性唯一性.

- UniqueTogetherValidator 用来增强 unique_together 约束.

- UniqueForDateValidator, UniqueForMonthValidator, UniqueForYearValidator 用来增强和日期相关的约束, 比如

```shell
from rest_framework.validators import UniqueForYearValidator

class ExampleSerializer(serializers.Serializer):
    # ...
    class Meta:
        # 今年的博客的slug不能有重复!
        validators = [
            UniqueForYearValidator(
                queryset=BlogPostItem.objects.all(),
                field='slug',
                date_field='published'
            )
        ]        
```

# 高级默认属性: 有时, 验证器需要一些参数, 这些参数不来自于客户端, 但是验证器需要这些参数, 比如一些 Hidden 参数. 我们可以使用两种方式来实现:

- 使用 HiddenField, 这个属性会出现在 validated_data中, 但是不会显示.
- 使用一个 read_only=True, 同时提供一个 default值. 这样的话, 会显示, 但是这个值不由用户设定.

# 自定义验证器

- 基于Function的验证器可以提出一个 ValidationError. 比如: 
```shell
def even_number(value):
    if value % 2 != 0:
        raise serializers.ValidationError('This field must be an even number.')
```

- 对于个别参数的验证, 可以写在 `validate_<field_name>` 中

# Authentication

- 身份识别 = 授权. 一般在view运行的最前面. 我们一般会用到两个属性: request.user 和  request.auth

- 默认有两种验证机制: BaseAuthentication (用户名和密码), SessionAuthentication (网页Session验证)

- TokenAuthentication 这种token认证方式不够安全, 因为没有过期时间, 最好是使用JWT的token认证方式.

# Permissions

- 最简单的权限验证包括: IsAuthenticated. 登录就可以.

- 我们可以在 settings 中设定一个默认的 permission类, 如:

```shell
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}
```
也可以在view中设定, 但是如果我们在view中设定后, setting.py中的设定将无效.

- 很多时候我们需要自定义permission, 如下:

```shell
class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'SUPERADMIN'
```






