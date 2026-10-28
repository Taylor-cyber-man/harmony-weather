# 多城市天气预报（HarmonyOS）

基于 HarmonyOS JS（HML / CSS / JS）开发的天气应用，支持多城市切换、逐时天气、温度曲线与桌面服务卡片。

## 功能

- **当前天气**：实时温度、天气状况、湿度、风向风速
- **逐时天气**：24 小时温度与天气图标
- **温度曲线**：Canvas 绘制全天温度变化趋势
- **生活指数**：穿衣、洗车、运动、紫外线等建议
- **空气质量**：AQI 等级与主要污染物
- **降雨量**：未来降雨量柱状展示
- **多城市管理**：城市搜索、切换、保存与缓存
- **服务卡片**：桌面卡片展示简要天气信息

## 技术栈

- HarmonyOS JS FA 模型：HML + CSS + JS
- 自定义组件：`briefWeatherInfo`、`timeWeather`、`temperatureChart`、`livingIndex`、`qualityWeather`、`rainCounter`、`senseList`
- 本地缓存：`@ohos.data.storage` / preferences

## 运行

1. 使用 DevEco Studio 打开工程，等待依赖同步
2. 连接模拟器或真机运行

## 文档

`docs/` 目录包含需求说明书、功能分析与上架流程说明。

## 目录结构

```
entry/src/main/js
├── MainAbility/           # 主页面与各天气组件
│   ├── common/components/ # 逐时天气、温度曲线、生活指数等
│   └── common/utils/      # 城市管理、天气数据、图标选择
└── FormAbility/           # 桌面服务卡片
```
