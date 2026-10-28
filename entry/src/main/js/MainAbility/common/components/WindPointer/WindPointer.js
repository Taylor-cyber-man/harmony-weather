
export default {
    props: ['otherData'], // 核心修改：weatherData → otherData
    data: {
        Wind: "",
        WindLevel: "",
        windArrow: "●"
    },

    onInit() {
        this.onChange();
        this.$watch('otherData', 'onChange'); // 监听修改后的 props 名称
    },

    onChange() {
        // 核心修改：this.weatherData → this.otherData
        const data = this.otherData || {};
        this.Wind = data.wind_dir || "无风向";
        this.WindLevel = data.wind_class || "0级";

        switch (this.Wind) {
            case '北风':
                this.windArrow = "↑";
                break;
            case '东北风':
                this.windArrow = "↗";
                break;
            case '西南风':
                this.windArrow = "↙";
                break;
            case '东风':
                this.windArrow = "→";
                break;
            case '东南风':
                this.windArrow = "↘";
                break;
            case '西风':
                this.windArrow = "←";
                break;
            case '西北风':
                this.windArrow = "↖";
                break;
            case '南风':
                this.windArrow = "↓";
                break;
            default:
                this.windArrow = "●";
                break;
        }
        console.info(this.Wind + this.WindLevel);
    }
};