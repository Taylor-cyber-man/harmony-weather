import router from '@ohos.router';

export default {
    data: {
        timeout: 0 // 进度条初始百分比
    },
    onInit() {
        this.updateProgress(); // 初始化时启动进度更新
    },
    updateProgress() {
        // 每隔30毫秒更新进度，直至100%
        let intervalId = setInterval(() => {
            if (this.timeout < 100) {
                this.timeout += 1;
            } else {
                clearInterval(intervalId);
                this.navigateToPage(); // 进度满后跳转
            }
        }, 30);
    },
    navigateToPage() {
        // 跳转到天气主页面
        router.replaceUrl({
            url: 'pages/weather/weather'
        });
    }
};