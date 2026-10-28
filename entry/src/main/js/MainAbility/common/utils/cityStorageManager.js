import storage from '@system.storage';

/**
 * 城市数据管理类
 */
class CityStorageManager {
    constructor() {
        this.maxSavedCities = 10; // 最多保存10个城市
    }

    /**
     * 获取当前城市
     * @param {function} callback - 回调函数
     */
    getCurrentCity(callback) {
        storage.get({
            key: 'currentCity',
            success: (data) => {
                callback(data || '深圳');
            },
            fail: () => {
                callback('深圳');
            }
        });
    }

    /**
     * 设置当前城市
     * @param {string} cityName - 城市名称
     * @param {function} callback - 回调函数
     */
    setCurrentCity(cityName, callback) {
        storage.set({
            key: 'currentCity',
            value: cityName,
            success: () => {
                // 同时添加到已保存城市列表
                this.addToSavedCities(cityName, callback);
            },
            fail: callback
        });
    }

    /**
     * 获取已保存的城市列表
     * @param {function} callback - 回调函数
     */
    getSavedCities(callback) {
        storage.get({
            key: 'savedCities',
            success: (data) => {
                try {
                    const cities = data ? JSON.parse(data) : [];
                    callback(cities);
                } catch (e) {
                    callback([]);
                }
            },
            fail: () => {
                callback([]);
            }
        });
    }

    /**
     * 添加城市到已保存列表
     * @param {string} cityName - 城市名称
     * @param {function} callback - 回调函数
     */
    addToSavedCities(cityName, callback) {
        this.getSavedCities((cities) => {
            // 如果城市已存在，先移除
            const index = cities.indexOf(cityName);
            if (index > -1) {
                cities.splice(index, 1);
            }

            // 添加到列表开头
            cities.unshift(cityName);

            // 限制列表长度
            if (cities.length > this.maxSavedCities) {
                cities = cities.slice(0, this.maxSavedCities);
            }

            // 保存
            storage.set({
                key: 'savedCities',
                value: JSON.stringify(cities),
                success: callback,
                fail: callback
            });
        });
    }

    /**
     * 从已保存列表删除城市
     * @param {string} cityName - 城市名称
     * @param {function} callback - 回调函数
     */
    removeFromSavedCities(cityName, callback) {
        this.getSavedCities((cities) => {
            const index = cities.indexOf(cityName);
            if (index > -1) {
                cities.splice(index, 1);
                storage.set({
                    key: 'savedCities',
                    value: JSON.stringify(cities),
                    success: callback,
                    fail: callback
                });
            } else {
                if (callback) callback();
            }
        });
    }

    /**
     * 清除所有已保存的城市
     * @param {function} callback - 回调函数
     */
    clearSavedCities(callback) {
        storage.delete({
            key: 'savedCities',
            success: callback,
            fail: callback
        });
    }

    /**
     * 获取热门城市列表
     */
    getHotCities() {
        return [
            '北京', '上海', '广州', '深圳', '杭州', '成都',
            '武汉', '西安', '南京', '重庆', '天津', '苏州',
            '长沙', '郑州', '青岛', '大连', '宁波', '厦门',
            '福州', '济南', '沈阳', '合肥', '南昌', '昆明',
            '贵阳', '兰州', '乌鲁木齐', '哈尔滨', '长春', '石家庄'
        ];
    }

    /**
     * 搜索城市
     * @param {string} keyword - 搜索关键词
     */
    searchCities(keyword) {
        const allCities = this.getHotCities();
        if (!keyword) {
            return allCities;
        }
        return allCities.filter(city => city.includes(keyword));
    }
}

// 导出单例
export default new CityStorageManager();
