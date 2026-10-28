import {imgSelect} from '../../utils/imgSelect'
export default {
    props: ['timeData'],
    data: {
        time: []
    },
    onInit() {
        this.onChange();
        this.$watch('timeData', 'onChange');
    },

    onChange() {
        // 添加安全检查确保 timeData 存在
        if (!this.timeData || !Array.isArray(this.timeData) || this.timeData.length === 0) {
            console.warn('timeData is invalid');
            return;
        }
        
        this.time = [];
        for (let index = 0; index < this.timeData.length; index++) {
            const element = this.timeData[index];
            if (!element || !element.data_time) {
                console.warn('Invalid element at index', index);
                continue;
            }
            
            let data = `${element.data_time}`;
            let dataArray = data.split(" ");
            
            // 检查是否包含空格和时间部分
            let timeStr;
            if (dataArray.length > 1 && dataArray[1]) {
                // 格式: "2023-01-02 23:00:00"
                let formattedDate = dataArray[1].split(":");
                timeStr = formattedDate[0] + ":" + formattedDate[1];
            } else if (data.includes(":")) {
                // 格式: "23:00" 或 "23:00:00"
                let parts = data.split(":");
                timeStr = parts[0] + ":" + parts[1];
            } else {
                // 无效格式，跳过
                console.warn('Invalid time format:', data);
                continue;
            }
            
            let newItem = {
                "data_time": timeStr,
                "img": imgSelect(element.text),
                "text": element.text,
                "temp_fc": element.temp_fc + "℃"
            };

            this.time.push(Object.assign({}, newItem));
        }
    }
}
