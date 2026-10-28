import storage from '@system.storage';

/**
 * 多城市天气数据管理类
 */
class CityWeatherManager {
    constructor() {
        this.weatherCache = {}; // 天气数据缓存
        this.cacheTimeout = 30 * 60 * 1000; // 缓存30分钟
    }

    /**
     * 获取城市天气数据
     * @param {string} cityName - 城市名称
     * @param {function} callback - 回调函数
     */
    getCityWeather(cityName, callback) {
        // 检查缓存
        const cached = this.weatherCache[cityName];
        if (cached && (Date.now() - cached.timestamp < this.cacheTimeout)) {
            callback(cached.data);
            return;
        }

        // 从存储中加载
        storage.get({
            key: `weather_${cityName}`,
            success: (data) => {
                if (data) {
                    try {
                        const weatherData = JSON.parse(data);
                        this.weatherCache[cityName] = {
                            data: weatherData,
                            timestamp: Date.now()
                        };
                        callback(weatherData);
                    } catch (e) {
                        // 解析失败，返回模拟数据
                        this.getMockWeather(cityName, callback);
                    }
                } else {
                    // 没有缓存数据，返回模拟数据
                    this.getMockWeather(cityName, callback);
                }
            },
            fail: () => {
                // 加载失败，返回模拟数据
                this.getMockWeather(cityName, callback);
            }
        });
    }

    /**
     * 保存城市天气数据
     * @param {string} cityName - 城市名称
     * @param {object} weatherData - 天气数据
     */
    saveCityWeather(cityName, weatherData) {
        this.weatherCache[cityName] = {
            data: weatherData,
            timestamp: Date.now()
        };

        storage.set({
            key: `weather_${cityName}`,
            value: JSON.stringify(weatherData)
        });
    }

    /**
     * 获取模拟天气数据
     * @param {string} cityName - 城市名称
     * @param {function} callback - 回调函数
     */
    getMockWeather(cityName, callback) {
        // 根据不同城市生成略有差异的模拟数据
        const mockData = this.generateMockData(cityName);
        this.saveCityWeather(cityName, mockData);
        callback(mockData);
    }

    /**
     * 生成模拟数据
     * @param {string} cityName - 城市名称
     */
    generateMockData(cityName) {
        // 为不同城市生成不同的温度范围
        const cityTemps = {
            '北京': { base: 25, range: 10 },
            '上海': { base: 28, range: 8 },
            '广州': { base: 32, range: 6 },
            '深圳': { base: 30, range: 7 },
            '成都': { base: 26, range: 9 },
            '杭州': { base: 27, range: 8 },
            '武汉': { base: 29, range: 10 },
            '西安': { base: 24, range: 12 }
        };

        const tempConfig = cityTemps[cityName] || { base: 25, range: 10 };
        const currentTemp = tempConfig.base + Math.floor(Math.random() * 5) - 2;
        const high = currentTemp + Math.floor(Math.random() * 5) + 1;
        const low = currentTemp - Math.floor(Math.random() * 5) - 1;

        return {
            tempData: {
                temp: currentTemp.toString(),
                text: this.getRandomWeather(),
                high: high.toString(),
                low: low.toString(),
                aqi: (40 + Math.floor(Math.random() * 60)).toString(),
                aqi_level: "优"
            },
            timeData: this.generateHourlyData(currentTemp),
            weeklyData: this.generateWeeklyData(high, low),
            otherData: this.generateOtherData(),
            airQuality: this.generateAirQuality(),
            suggestion: this.generateSuggestion()
        };
    }

    getRandomWeather() {
        const weathers = ['晴', '多云', '阴', '小雨', '雷阵雨'];
        return weathers[Math.floor(Math.random() * weathers.length)];
    }

    generateHourlyData(baseTemp) {
        const hourlyData = [];
        const now = new Date();
        const currentHour = now.getHours();
        
        for (let i = 0; i < 24; i++) {
            const hour = new Date(now.getTime() + i * 3600000);
            const hourOfDay = (currentHour + i) % 24;
            
            // 根据时间计算温度变化，符合自然规律
            let tempOffset = 0;
            if (hourOfDay >= 0 && hourOfDay < 6) {
                // 凌晨0-6点：最低温，-4到-2度
                tempOffset = -4 + (hourOfDay / 6) * 2;
            } else if (hourOfDay >= 6 && hourOfDay < 14) {
                // 6-14点：温度逐渐上升，-2到+4度
                tempOffset = -2 + ((hourOfDay - 6) / 8) * 6;
            } else if (hourOfDay >= 14 && hourOfDay < 18) {
                // 14-18点：最高温，+3到+4度
                tempOffset = 4 - ((hourOfDay - 14) / 4) * 1;
            } else {
                // 18-24点：温度下降，+3到-4度
                tempOffset = 3 - ((hourOfDay - 18) / 6) * 7;
            }
            
            // 加入小随机波动，更真实
            const randomOffset = (Math.random() - 0.5) * 1.5;
            const temp = Math.round(baseTemp + tempOffset + randomOffset);
            
            hourlyData.push({
                data_time: hour.toISOString().replace('T', ' ').substring(0, 19),
                temp_fc: temp.toString(),
                text: this.getRandomWeather()
            });
        }
        return hourlyData;
    }

    generateWeeklyData(high, low) {
        const weeks = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
        const weeklyData = [];
        
        for (let i = 0; i < 7; i++) {
            weeklyData.push({
                week: weeks[i],
                text_day: this.getRandomWeather(),
                high: (high + Math.floor(Math.random() * 4) - 2).toString(),
                low: (low + Math.floor(Math.random() * 4) - 2).toString(),
                wd_day: ['东风', '西风', '南风', '北风'][Math.floor(Math.random() * 4)],
                wc_day: '<' + (Math.floor(Math.random() * 3) + 1) + '级'
            });
        }
        return weeklyData;
    }

    generateOtherData() {
        const cloudCount = Math.floor(Math.random() * 20) + 75;
        return {
            wind_dir: ['东风', '西风', '南风', '北风'][Math.floor(Math.random() * 4)],
            wind_class: (Math.floor(Math.random() * 3) + 1) + '级',
            text: this.getRandomWeather(),
            clouds_count: [
                cloudCount.toString(), 
                (cloudCount + 5).toString(), 
                (cloudCount + 10).toString(), 
                (cloudCount - 5).toString(), 
                (cloudCount + 15).toString()
            ],
            rain_count: [
                Math.floor(Math.random() * 100) + 150, 
                Math.floor(Math.random() * 100) + 180, 
                Math.floor(Math.random() * 100) + 160, 
                Math.floor(Math.random() * 100) + 200, 
                Math.floor(Math.random() * 100) + 120
            ],
            rh: (30 + Math.floor(Math.random() * 40)).toString(),
            uv: Math.floor(Math.random() * 10).toString(),
            pressure: (1010 + Math.floor(Math.random() * 20)).toString(),
            feel_like: (20 + Math.floor(Math.random() * 15)).toString()
        };
    }

    generateAirQuality() {
        return {
            aqi: (40 + Math.floor(Math.random() * 60)).toString(),
            PM10: (50 + Math.floor(Math.random() * 50)).toString(),
            PM25: (30 + Math.floor(Math.random() * 40)).toString(),
            NO2: (40 + Math.floor(Math.random() * 30)).toString(),
            SO2: Math.floor(Math.random() * 15).toString(),
            CO: (0.5 + Math.random() * 1).toFixed(1),
            O3: Math.floor(Math.random() * 20).toString()
        };
    }

    generateSuggestion() {
        return [
            {
                type: "cl",
                name: "晨练指数",
                brief: "较适宜",
                detail: "注意选择通风凉爽的地点进行晨练。"
            },
            {
                type: "xc",
                name: "洗车指数",
                brief: "适宜",
                detail: "天气较好，适合擦拭洗车。"
            },
            {
                type: "zwx",
                name: "紫外线指数",
                brief: "中等",
                detail: "注意防晒。"
            },
            {
                type: "gm",
                name: "感冒指数",
                brief: "较易发",
                detail: "注意保暖别着凉。"
            },
            {
                type: "ls",
                name: "晾晒指数",
                brief: "适宜",
                detail: "可以晒晒被子。"
            },
            {
                type: "cy",
                name: "穿衣指数",
                brief: "较舒适",
                detail: "短袖外套刚刚好。"
            }
        ];
    }

    /**
     * 清除城市天气缓存
     * @param {string} cityName - 城市名称
     */
    clearCityWeatherCache(cityName) {
        delete this.weatherCache[cityName];
        storage.delete({
            key: `weather_${cityName}`
        });
    }

    /**
     * 清除所有缓存
     */
    clearAllCache() {
        this.weatherCache = {};
    }
}

// 导出单例
export default new CityWeatherManager();
