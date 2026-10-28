export default {
    props:['tempData'],
    data:{
        title:"",
        C:"℃",
        weather:"",
        air:"",
    },

    onInit(){
        this.onChange()
        this.$watch('tempData','onChange')
    },

    onChange(){
        this.title=this.tempData.temp;
        this.weather=`${this.tempData.text}  ${this.tempData.high}°C/${this.tempData.low}°C`
        this.air="空气"+this.tempData.aqi_level+" "+this.tempData.aqi
}
}