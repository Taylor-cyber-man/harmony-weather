import {imgSelect} from '../../utils/imgSelect';
export default {
    props:['weeklyData'],
    data:{
        day:[]
    },

    onInit(){
        this.onChange()
        this.$watch('weeklyData','onChange')
    },

    onChange(){
        for (let index = 0; index < this.weeklyData.length; index++) {
            const element = this.weeklyData[index];
            let newItem={
                "week":element.week,
                "text_day":element.text_day,
                "img":imgSelect(element.text_day),
                "high":element.high,
                "low":element.low,
                "wd_day":element.wd_day,
                "wc_day":element.wc_day,
            }
            this.day.push(Object.assign({},newItem))
        }
    }
}