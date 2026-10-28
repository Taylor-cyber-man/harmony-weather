export default {
    props: ['newTime'],
    data: {
        end: "数据来源：中国天气",
        time: "更新时间：2025年11月29日"
    },

    onInit() {
        this.onChange();
        this.$watch('newTime', 'onChange');
    },

    onChange() {
        if (this.newTime && typeof this.newTime === 'string') {
            this.time = `更新时间：${this.newTime}`;
        } else {
            this.time = "更新时间：2025年11月29日";
        }
    }
};