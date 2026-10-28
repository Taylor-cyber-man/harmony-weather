export default {
    props: ['suggest'], // 保留你原有的 props 传递
    data: {
        title: "生活指数",
        exercise: "",
        dress: "",
        sunshine: "",
        cold: "",
        carWashing: "",
        sun_cure: ""
    },

    onInit() {
        this.onChange();
        this.$watch('suggest', 'onChange'); // 保留你原有的监听
    },

    onChange() {
        // 核心修复1：多重容错，避免 suggest 为 undefined 或非数组
        const suggestList = this.suggest || [];
        if (!Array.isArray(suggestList)) return;

        // 核心修复2：使用有效索引（0-5），对应父组件实际数据顺序
        // 运动 = 晨练指数（索引0）
        this.exercise = suggestList[0]?.brief || "未知";
        // 穿衣 = 穿衣指数（索引5）
        this.dress = suggestList[5]?.brief || "未知";
        // 紫外线 = 紫外线指数（索引2）
        this.sunshine = suggestList[2]?.brief || "未知";
        // 感冒 = 感冒指数（索引3）
        this.cold = suggestList[3]?.brief || "未知";
        // 洗车 = 洗车指数（索引1）
        this.carWashing = suggestList[1]?.brief || "未知";
        // 晾晒 = 晾晒指数（索引4）
        this.sun_cure = suggestList[4]?.brief || "未知";
    }
};