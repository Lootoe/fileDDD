## test 规则校验

uView内置了一些校验规则，如是否手机号，邮箱号，URL等
这些规则方法，挂载在`$u.test`下面，如验证是否手机号：`$u.test.mobile('13888889999')`，如果验证通过，返回`true`，否则返回`false`

### [#](https://www.uviewui.com/js/test.html#是否验证码)是否验证码

#### [#](https://www.uviewui.com/js/test.html#code-value-len-6)code(value, len = 6)

校验是否验证码(要求为数字)，返回`true`或者`false`。

- `value` <String> 验证码字符串
- `len` <Number> 验证码长度，默认为6

```js
console.log(uni.$u.test.code('4567', 4));
```

### [#](https://www.uviewui.com/js/test.html#是否数组)是否数组

#### [#](https://www.uviewui.com/js/test.html#array-array)array(array)

校验是否数组，返回`true`或者`false`。

- `array` <Array> 数组

```js
console.log(uni.$u.test.array([1, 2, 3]));
```

### [#](https://www.uviewui.com/js/test.html#是否json字符串)是否Json字符串

#### [#](https://www.uviewui.com/js/test.html#jsonstring-json)jsonString(json)

校验是否数组，返回`true`或者`false`。

- `json` <Json> Json字符串

注意：请留意json字符串的要求：

1. 整体为一个字符串
2. 字符串对象内的属性需要用`""`双引号包含

```js
console.log(uni.$u.test.jsonString('{"a": 1}'));
```

### [#](https://www.uviewui.com/js/test.html#是否对象)是否对象

#### [#](https://www.uviewui.com/js/test.html#object-object)object(object)

校验是否数组，返回`true`或者`false`。

- `object` <Object> 对象

```js
console.log(uni.$u.test.object({a: 1}));
```

### [#](https://www.uviewui.com/js/test.html#是否邮箱号)是否邮箱号

#### [#](https://www.uviewui.com/js/test.html#email-email)email(email)

校验是否邮箱号，返回`true`或者`false`。

- `email` <String> 字符串

```js
console.log(uni.$u.test.email('123465798@gmail.com'));
```

### [#](https://www.uviewui.com/js/test.html#是否手机号)是否手机号

#### [#](https://www.uviewui.com/js/test.html#mobile-mobile)mobile(mobile)

校验是否手机号，返回`true`或者`false`。

- `mobile` <String> 字符串

```js
console.log(uni.$u.test.mobile('13845678900'));
```

### [#](https://www.uviewui.com/js/test.html#是否url)是否URL

#### [#](https://www.uviewui.com/js/test.html#url-url)url(url)

校验是否URL链接，返回`true`或者`false`。

- `url` <String> 字符串

```js
console.log(uni.$u.test.url('http://www.uviewui.com'));
```

### [#](https://www.uviewui.com/js/test.html#是否为空)是否为空

这里指的“空”，包含如下几种情况：

- 值为`undefined`(一种类型)，非字符串`"undefined"`
- 字符串长度为0，也即空字符串
- 值为`false`(布尔类型)，非字符串`"false"`
- 值为数值`0`(非字符串`"0"`)，或者`NaN`
- 值为`null`，空对象`{}`，或者长度为0的数组

#### [#](https://www.uviewui.com/js/test.html#isempty-value)isEmpty(value)

校验值是否为空，返回`true`或者`false`。
此方法等同于`empty`名称，但是为了更语义化，推荐用`isEmpty`名称。

- `value` <any> 字符串

```js
console.log(uni.$u.test.isEmpty(false));
```

### [#](https://www.uviewui.com/js/test.html#是否普通日期)是否普通日期

验证一个字符串是否日期，返回`true`或者`false`，如下行为正确：

- `2020-02-10`、`2020-02-10 08:32:10`、`2020/02/10 3:10`、`2020/02/10 03:10`、`2020/02-10 3:10`

如下为错误：

- `2020年02月10日`、`2020-02-10 25:32`

总的来说，年月日之间可以用"/"或者"-"分隔(不能用中文分隔)，时分秒之间用":"分隔，数值不能超出范围，如月份不能为13，则检验成功，否则失败。

#### [#](https://www.uviewui.com/js/test.html#date-date)date(date)

- `date` <String> 日期字符串

```js
console.log(uni.$u.test.date('2020-02-10 08:32:10'));
```

### [#](https://www.uviewui.com/js/test.html#是否十进制数值)是否十进制数值

整数，小数，负数，带千分位数(2,359.08)等可以检验通过，返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#number-number)number(number)

- `number` <String> 数字

```js
console.log(uni.$u.test.number('2020'));
```

### [#](https://www.uviewui.com/js/test.html#是否整数)是否整数

所有字符都在`0-9`之间，才校验通过，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#digits-number)digits(number)

- `number` <String> 数字

```js
console.log(uni.$u.test.digits('2020'));
```

### [#](https://www.uviewui.com/js/test.html#是否身份证号)是否身份证号

身份证号，包括尾数为"X"的类型，可以校验通过，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#idcard-idcard)idCard(idCard)

- `idCard` <String> 身份证号

```js
console.log(uni.$u.test.idCard('110101199003070134'));
```

### [#](https://www.uviewui.com/js/test.html#是否车牌号)是否车牌号

可以校验旧车牌号和新能源类型车牌号，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#carno-carno)carNo(carNo)

- `carNo` <String> 车牌号

```js
console.log(uni.$u.test.carNo('京A88888'));
```

### [#](https://www.uviewui.com/js/test.html#是否金额)是否金额

最多两位小数，可以带千分位，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#amount-amount)amount(amount)

- `amount` <String> 金额字符串

```js
console.log(uni.$u.test.amount('3,233.08'));
```

### [#](https://www.uviewui.com/js/test.html#是否汉字)是否汉字

可以为单个汉字，或者汉字组成的字符串，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#chinese-zh)chinese(zh)

- `zh` <String> 中文字符串

```js
console.log(uni.$u.test.chinese('更上一层楼'));
```

### [#](https://www.uviewui.com/js/test.html#是否字母)是否字母

只能为"a-z"或者"A-Z"之间的字符，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#letter-en)letter(en)

- `en` <String> 字母串

```js
console.log(uni.$u.test.letter('uView'));
```

### [#](https://www.uviewui.com/js/test.html#是否字母或者数字)是否字母或者数字

只能是字母或者数字，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#enornum-str)enOrNum(str)

- `str` <String> 字母或者数字字符串

```js
console.log(uni.$u.test.enOrNum('uView'));
```

### [#](https://www.uviewui.com/js/test.html#是否包含某个值)是否包含某个值

字符串中是否包含某一个子字符串，区分大小写，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#contains-str-substr)contains(str, subStr)

- `str` <String> 字符串
- `subStr` <String> 子字符串

```js
console.log(uni.$u.test.contains('uView', 'View'));
```

### [#](https://www.uviewui.com/js/test.html#数值是否在某个范围内)数值是否在某个范围内

如30在"29-35"这个范围内，不在"25-28"这个范围内，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#range-number-range)range(number, range)

- `number` <Number> 数值
- `range` <Array> 如"[25-35]"

```js
console.log(uni.$u.test.range(35, [30, 34]));
```

### [#](https://www.uviewui.com/js/test.html#字符串长度是否在某个范围内)字符串长度是否在某个范围内

如"abc"长度为3，范围在"2-5"这个区间，结果返回`true`或者`false`。

#### [#](https://www.uviewui.com/js/test.html#rangelength-str-range)rangeLength(str, range)

- `str` <String> 数值
- `range` <Array> 如"[25, 35]"

```js
console.log(uni.$u.test.rangeLength('abc', [3, 10]));
```