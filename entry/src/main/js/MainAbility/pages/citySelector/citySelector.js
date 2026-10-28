import router from '@system.router';
import Prompt from '@system.prompt';
import cityStorageManager from '../../common/utils/cityStorageManager';
import cityWeatherManager from '../../common/utils/cityWeatherManager';

export default {
    data: {
        currentCity: '深圳',
        savedCities: [],
        hotCities: [],
        searchText: '',
        allCities: []
    },
    
    onInit() {
        this.loadCurrentCity();
        this.loadSavedCities();
        this.initAllCities();
    },
    
    onShow() {
        this.loadCurrentCity();
        this.loadSavedCities();
    },
    
    loadCurrentCity() {
        cityStorageManager.getCurrentCity((city) => {
            this.currentCity = city;
        });
    },
    
    loadSavedCities() {
        cityStorageManager.getSavedCities((cities) => {
            this.savedCities = cities;
        });
    },
    
    initAllCities() {
        this.allCities = cityStorageManager.getHotCities();
        this.hotCities = [...this.allCities];
    },
    
    selectCity(e) {
        const city = e.detail ? e.detail.city : e;
        
        // 使用城市存储管理器保存当前城市
        cityStorageManager.setCurrentCity(city, () => {
            Prompt.showToast({
                message: `已切换到 ${city}`,
                duration: 2000
            });
            
            // 返回天气页面
            router.back();
        });
    },
    
    deleteCity(e) {
        const city = e.detail ? e.detail.city : e;
        cityStorageManager.removeFromSavedCities(city, () => {
            // 重新加载列表
            this.loadSavedCities();
            Prompt.showToast({
                message: `已删除 ${city}`,
                duration: 2000
            });
        });
    },
    
    handleSearch(e) {
        this.searchText = e.value;
        // 使用城市存储管理器进行搜索
        this.hotCities = cityStorageManager.searchCities(this.searchText);
    },
    
    closePage() {
        router.back();
    }
}
