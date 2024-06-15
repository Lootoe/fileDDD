## REM布局

### 用法

根字体宽度 = 设计稿字体宽度 * (屏幕宽度 / 设计稿宽度)

这样就能保证当屏幕变大时，跟字体宽度也会随之变大

```js
<script>
    // 更新根元素的字体宽度
    let UpdateWidth = function(designFontWidth = 16, designPaperWidth = 320, maxWidth = 40) {
        /* 
            designFontSize: 设计稿字体宽度
            designPaperSize： 设计稿宽度
            最大字体宽度:40px 
         */
        // 获取屏幕宽度
        let ScreenWidth = document.documentElement.clientWidth;
        // 更新限制字体最大宽度
        // 根字体宽度 = 设计稿字体宽度 * (屏幕宽度 / 设计稿宽度)
        let rootFontSize = designFontWidth * (ScreenWidth / designPaperWidth) > maxWidth ? maxWidth : designFontWidth * (ScreenWidth / designPaperWidth)
        document.documentElement.style.fontSize = `${rootFontSize}px`
    }
    // 视口初始化、视口大小变化时更新根字体宽度
    window.addEventListener("load", () => {
        UpdateWidth(20, 320)
    })
    window.addEventListener("resize", () => {
        UpdateWidth(20, 320)
    })
</script>
```

### 缺点

在响应式布局中，必须通过js来动态控制根元素`font-size`的大小，也就是说css样式和js代码有一定的耦合性

且必须将改变`font-size`的代码放在`css`样式之前

### 多屏幕适配

`REM`布局也是目前多屏幕适配的最佳方式，默认情况下我们html标签的`font-size`为16px

我们利用媒体查询，设置在不同设备下的字体大小

```css
/* pc width > 1100px */
html{ font-size: 100%;}
body {
    background-color: yellow;
    font-size: 1.5rem;
}
/* ipad pro */
@media screen and (max-width: 1024px) {
    body {
      background-color: #FF00FF;
      font-size: 1.4rem;
    }
}
/* ipad */
@media screen and (max-width: 768px) {
    body {
      background-color: green;
      font-size: 1.3rem;
    }
}
/* iphone6 7 8 plus */
@media screen and (max-width: 414px) {
    body {
      background-color: blue;
      font-size: 1.25rem;
    }
}
/* iphoneX */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 3) {
    body {
      background-color: #0FF000;
      font-size: 1.125rem;
    }
}
/* iphone6 7 8 */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 2) {
    body {
      background-color: #0FF000;
      font-size: 1rem;
    }
}
/* iphone5 */
@media screen and (max-width: 320px) {
    body {
      background-color: #0FF000;
      font-size: 0.75rem;
    }
}
```





## VM

### 用法

`css3`中引入了一个新的单位`vw/vh`，与视图窗口有关，`vw`表示相对于视图窗口的宽度，`vh`表示相对于视图窗口高度

除了`vw`和`vh`外，还有`vmin`和`vmax`两个相关的单位，各个单位具体的含义如下：

| 单位 | 含义                                                      |
| ---- | --------------------------------------------------------- |
| vw   | 相对于视窗的宽度，1vw 等于视口宽度的1%，即视窗宽度是100vw |
| vh   | 相对于视窗的高度，1vh 等于视口高度的1%，即视窗高度是100vh |
| vmin | vw和vh中的较小值                                          |
| vmax | vw和vh中的较大值                                          |

### 缺点

虽然采用`vw`适配后的页面效果很好，但是它是利用视口单位实现的布局

依赖视口大小而自动缩放，无论视口过大还是过小，它也随着时候过大或者过小，失去了最大最小宽度的限制





## VM + REM

### 用法

 现在有了vm单位，不需要通过JS计算了

 如果想保证1rem始终为视口宽度的1/10，只需要设置`font-size:10vm`

 但是这样750px的设计稿，`1rem = 10vm = 75px`

 如果设计稿某个元素尺寸100px，那么转化为rem就是`(1/75)*100rem`，很复杂

 所以，为了防止还原设计稿时单位计算复杂，可以让`1rem = 100px`

 由于，`屏幕的100% = 设计稿750px ===> 100vw = 750px ===> 1px = (100/750)vw`

 所以，`1rem = (100/750)*100vw  = 13.3333333333333vw`

```css
html {
  font-size: calc((100 / 750) * 100vw);
}
```

### 限制最大/最小值

限制font-size能变化的屏幕区间范围为：`320px - 540px`

320尺寸下的font-size：`320px = 100vw  ===> 1vw = 3.2px  ===> (100 / 750) * 100vw = ((100 / 750) * 100)*3.2px = 42.6666667px`

540尺寸下的font-size：`540px = 100vw  ===> 1vw = 5.4px  ===> (100 / 750) * 100vw = ((100 / 750) * 100)*5.4px = 72px`

```css
@media screen and (max-width: 320px) {
  html {
    font-size: 42.66666666667px;
  }
}

/* 540px = 100vw  ===> 1vw = 5.4px   ===> (100 / 750) * 100vw = ((100 / 750) * 100)*5.4px = 42.6666667px */
@media screen and (min-width: 540px) {
  html {
    font-size: 72px;
  }
}
```

限制body的范围为`320px-540px`，避免默认100%宽度的 block 元素跟随 body 而过大过小

```css
body {
  max-width: 540px;
  min-width: 320px;
}
```

