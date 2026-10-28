// utils/imgSelect.js
const weatherImgMap = {
    "晴": "sunny.png",
    "多云": "cloudy.png",
    "阴": "nosun.png",
    "小雪": "snow.png",
    "小雨": "little rain.png",
    "中雨": "rain.png",
    "大雨": "big rain.png",
    "雨": "rain.png",
    "雪": "snow.png",
    "风": "windy.png",
    "夜间": "night.png",
    "雷阵雨": "thunder rain.png"
};

export function imgSelect(weatherText) {
    if (!weatherText || typeof weatherText !== 'string') {
        return '/common/img/other/sunny.png';
    }

    // 循环遍历映射表（适合后续扩展模糊匹配，如包含"雨"字就返回雨图标）
    for (const [key, iconFileName] of Object.entries(weatherImgMap)) {
        // 精确匹配（如需模糊匹配，可改为 weatherText.includes(key)）
        if (key === weatherText) {
            return `/common/img/other/${iconFileName}`;
        }
    }

    return '/common/img/other/sunny.png';
}