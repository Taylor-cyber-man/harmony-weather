import Prompt from '@system.prompt';
import app from '@system.app';
import cityWeatherManager from '../../common/utils/cityWeatherManager';
import cityStorageManager from '../../common/utils/cityStorageManager';

export default {
    data: {
       tempData:{
           temp:"25",
           text:"晴",
           high:"30",
           low:"20",
           aqi:"50",
           aqi_level:"优"
       },
        otherData:{
            wind_dir:"东风",
            wind_class:"1级",
            text:"晴",
            clouds_count:["80", "80", "80", "80", "80"],
            rain_count:[0, 0, 0, 0, 0],
            rh:"50",
            uv:"5",
            pressure:"1013",
            feel_like:"25"
        },
        weeklyData:[
            {
                week:"星期一",
                text_day:"晴",
                high:"30",
                low:"20",
                wd_day:"东风",
                wc_day:"<3级"
            }
        ],
        timeData:[
            { data_time: "2026-01-05 00:00:00", temp_fc: "22", text: "晴" },
            { data_time: "2026-01-05 01:00:00", temp_fc: "21", text: "晴" },
            { data_time: "2026-01-05 02:00:00", temp_fc: "20", text: "多云" }
        ],
        airQuality:{
            aqi:"50",
            PM10:"50",
            PM25:"30",
            NO2:"40",
            SO2:"10",
            CO:"0.8",
            O3:"10"
        },
        suggestion:[
            {
                type:"cl",
                name:"晨练指数",
                brief:"适宜",
                detail:"天气良好。"
            }
        ],
        time:{},
        path:"深圳",
        preTime:-1
    },
    onInit() {
        // 检查是否从卡片跳转
        const params = this.$app.$def.data || {};
        if (params.from === 'widget') {
            console.info('Launched from widget');
            Prompt.showToast({
                message: '欢迎使用天气应用',
                duration: 1500
            });
        }
        this.loadCurrentCity();
    },
    
    onShow() {
        // 每次页面显示时重新加载城市
        this.loadCurrentCity();
    },
    
    loadCurrentCity() {
        cityStorageManager.getCurrentCity((city) => {
            this.path = city;
            this.loadWeatherData();
        });
    },
    
    loadWeatherData() {
        // 使用城市天气管理器加载数据
        Prompt.showToast({
            message: `正在加载${this.path}天气...`,
            duration: 1500
        });
        
        cityWeatherManager.getCityWeather(this.path, (weatherData) => {
            // 更新页面数据
            this.tempData = weatherData.tempData;
            this.timeData = weatherData.timeData;
            this.weeklyData = weatherData.weeklyData;
            this.otherData = weatherData.otherData;
            this.airQuality = weatherData.airQuality;
            this.suggestion = weatherData.suggestion;
        });
    },
    
    loadMockWeatherData() {
        // 保留原有模拟数据作为后备方案
        this.path='深圳';
        this.tempData={
            temp:"30",
            text:"晴",
            high:"31",
            low:"26",
            aqi:"50",
            aqi_level:"优"
        };
        this.timeData= [
            { "data_time": "2023-01-02 23:00:00", "temp_fc": "-3", "text": "小雪" },
            { "data_time": "2023-01-02 00:00:00", "temp_fc": "-4", "text": "小雪" },
            { "data_time": "2023-01-02 01:00:00", "temp_fc": "-4", "text": "小雪" },
            { "data_time": "2023-01-02 02:00:00", "temp_fc": "-3", "text": "阴" },
            { "data_time": "2023-01-02 03:00:00", "temp_fc": "-3", "text": "阴" },
            { "data_time": "2023-01-02 04:00:00", "temp_fc": "-2", "text": "阴" },
            { "data_time": "2023-01-02 05:00:00", "temp_fc": "-2", "text": "阴" },
            { "data_time": "2023-01-02 06:00:00", "temp_fc": "-1", "text": "多云" },
            { "data_time": "2023-01-02 07:00:00", "temp_fc": "0", "text": "多云" },
            { "data_time": "2023-01-02 08:00:00", "temp_fc": "1", "text": "晴" },
            { "data_time": "2023-01-02 09:00:00", "temp_fc": "3", "text": "晴" },
            { "data_time": "2023-01-02 10:00:00", "temp_fc": "5", "text": "晴" },
            { "data_time": "2023-01-02 11:00:00", "temp_fc": "6", "text": "晴" },
            { "data_time": "2023-01-02 12:00:00", "temp_fc": "7", "text": "晴" },
            { "data_time": "2023-01-02 13:00:00", "temp_fc": "7", "text": "晴" },
            { "data_time": "2023-01-02 14:00:00", "temp_fc": "6", "text": "晴" },
            { "data_time": "2023-01-02 15:00:00", "temp_fc": "5", "text": "多云" },
            { "data_time": "2023-01-02 16:00:00", "temp_fc": "4", "text": "多云" },
            { "data_time": "2023-01-02 17:00:00", "temp_fc": "3", "text": "多云" },
            { "data_time": "2023-01-02 18:00:00", "temp_fc": "2", "text": "阴" },
            { "data_time": "2023-01-02 19:00:00", "temp_fc": "1", "text": "阴" },
            { "data_time": "2023-01-02 20:00:00", "temp_fc": "0", "text": "阴" },
            { "data_time": "2023-01-02 21:00:00", "temp_fc": "-1", "text": "阴" },
            { "data_time": "2023-01-02 22:00:00", "temp_fc": "-2", "text": "阴" }
        ];
        this.weeklyData=[
            {
                "week":"星期一",
                "text_day":"晴",
                "high":"33",
                "low":"26",
                "wd_day":"东风",
                "wc_day":"<3级"
            },
            {
                "week":"星期二",
                "text_day":"多云",
                "high":"28",
                "low":"25",
                "wd_day":"西风",
                "wc_day":"<2级"
            },
            {
                "week":"星期三",
                "text_day":"多云",
                "high":"33",
                "low":"26",
                "wd_day":"南风",
                "wc_day":"<3级"
            },
            {
                "week":"星期四",
                "text_day":"多云",
                "high":"33",
                "low":"26",
                "wd_day":"南风",
                "wc_day":"<3级"
            },
            {
                "week":"星期五",
                "text_day":"多云",
                "high":"33",
                "low":"26",
                "wd_day":"南风",
                "wc_day":"<3级"
            },
            {
                "week":"星期六",
                "text_day":"多云",
                "high":"33",
                "low":"26",
                "wd_day":"南风",
                "wc_day":"<3级"
            },
            {
                "week":"星期日",
                "text_day":"晴",
                "high":"33",
                "low":"26",
                "wd_day":"东风",
                "wc_day":"<3级"
            }
        ];
        this.otherData={
            "wind_dir":"东风",
            "wind_class":"1级",
            "text":"小雨",
            "clouds_count":[
                "90",
                "90",
                "90",
                "90",
                "90"
            ],
            "rain_count":[
                200,
                240,
                150,
                250,
                120
            ],
            "rh":"41",
            "uv":"0",
            "pressure":"1020",
            "feel_like":"10"
        };
        this.airQuality={
            "aqi":"60",
            "PM10":"70",
            "PM25":"34",
            "NO2":"49",
            "SO2":"7",
            "CO":"0.9",
            "O3":"6"
        };
        this.suggestion=[
            {
                "type":"cl",
                "name":"晨练指数",
                "brief":"较适宜",
                "detail":"注意选择通风凉爽的地点进行晨练。"
            },
            {
                "type":"xc",
                "name":"洗车指数",
                "brief":"适宜",
                "detail":"天气较厚，适合擦拭洗车。"
            },
            {
                "type":"zwx",
                "name":"紫外线指数",
                "brief":"中等",
                "detail":"注意防晒。"
            },
            {
                "type":"gm",
                "name":"感冒指数",
                "brief":"较易发",
                "detail":"注意保暖别着凉。"
            },
            {
                "type":"ls",
                "name":"晾晒指数",
                "brief":"适宜",
                "detail":"可以晒晒被子。"
            },
            {
                "type":"cy",
                "name":"穿衣指数",
                "brief":"较舒适",
                "detail":"短袖外套刚刚好。"
            }
        ];
    },
    
    loadMockWeatherData() {
        // 模拟数据 - 实际应用中应该根据 this.path 调用天气API
    },
    onBackPress(){
        console.info("onBackPress!!!")
        if(this.preTime==-1){
            this.preTime=new Date().getTime();
            Prompt.showToast({
                message:"再次返回退出小鸿天气",
                duration:2000,
                bottom:30
            })
            return true;
        }
        else{
            let currentTime=new Date().getTime();
            let flag=currentTime-this.preTime;
            if (flag>3000) {
                this.preTime=-1;
                return true;
            }
            else{
                app.terminate()
            }
        }
        return true;
    },

};


