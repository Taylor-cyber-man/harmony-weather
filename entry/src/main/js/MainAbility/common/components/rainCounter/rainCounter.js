export default {
    props: ['otherData'],
    data: {
        title: "云量:",
        cloud: "0",
        clouds: '/common/img/cloud1.png',
        isRain: false,
        rainBarData: [
            { data: [] }
        ],
        rainBarOps: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
        }
    },

    onInit() {
        this.onChange();
        this.$watch('otherData', 'onChange');
    },

    onChange() {
        const data = this.otherData || {};
        this.weather = data.text || "";

        if (this.weather.indexOf('雨') === -1) {
            this.isRain = false;
            const cloudCount = Array.isArray(data.clouds_count) ? data.clouds_count[0] || "0" : "0";
            this.cloud = "" + cloudCount + "%";

            if (cloudCount >= 67) {
                this.clouds = "/common/img/cloud1.png";
            } else if (cloudCount >= 33) {
                this.clouds = "/common/img/cloud1.png";
            } else if (cloudCount > 0) {
                this.clouds = "/common/img/cloud1.png";
            } else {
                this.clouds = "/common/img/cloud1.png";
            }
        }
    }
};