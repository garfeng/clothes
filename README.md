# 衣服生成器 for RPGmaker

衣服 = 版型 + 花色

其中，版型管理阴影和轮廓，为灰度图；花色为简单的色块。

将花色在版型上遮罩一层，即可生成一件新的衣服。

版型制作复杂，一个可以多用。

花色制作简单，制作时不需考虑阴影和高光。

以下为**相同版型**搭配**不同花纹**的示例：

![版型](https://raw.githubusercontent.com/garfeng/clothes/master/images/model/a_1.png) + ![花纹](https://raw.githubusercontent.com/garfeng/clothes/master/images/pattern/p_1.png) = ![衣服](https://raw.githubusercontent.com/garfeng/clothes/master/example/1.png)

![版型](https://raw.githubusercontent.com/garfeng/clothes/master/images/model/a_1.png) + ![花纹](https://raw.githubusercontent.com/garfeng/clothes/master/images/pattern/magua_1.png) = ![衣服](https://raw.githubusercontent.com/garfeng/clothes/master/example/2.png)



调用了 RPGmaker MV 自带的 rpg_core.js 和 rpg_manager.js，以及pixi.js


## 在线版 

[链接](http://garfeng.github.io/clothes)


## 离线版

1. 下载本仓库后，双击运行根目录下的webtest.exe，保持窗口不要关闭。

2. 打开谷歌浏览器，访问 http://localhost:8920 。


## 添加您自己的素材

### 版型

1. 制作3x4格式的行走图版型，版型需要是黑白的，需要把袖子切下来单独放置。
2. 两张图放进images/model目录下，文件名分别为：
```
总体行走图：xxx_1.png
袖子行走图：xxx_2.png
```
3. 编写data/data.json
```
{
	"model":["xxx","xxx","添加你的xxx"],
	"pattern":[……]
}
```

### 花色
1. 制作宽度为一个行走单位宽度两倍，高度和它相同的两个花色。
	比如xp默认行走图32x48，花色图为64x48，其中，前32像素为正面，后32为背面。

	制作两个花色，分别给总体行走图和袖子图上色。
2. 放进images/pattern目录下，文件名为：

```
总体行走图的花色：xxx_1.png
袖子行走图的花色：xxx_2.png
```
3. 编写data/data.json
```
{
	"model":[……],
	"pattern":["a","b","添加你的xxx"]
}
```

### 刷新

浏览器刷新页面，即可看到新添加的图。