export default {
    props:['aqi'],
    data:{
        title:"空气质量",
        airNumber:0,
        percentNumber:0,
        airQuality:"",
        PM2_5:0,
        PM10:0,
        SO2:0,
        NO2:0,
        CO:0,
        O3:0
    },

    onInit(){
        this.onChange()
        this.$watch('aqi','onChange')
        this.percentNumber=this.airNumber/3
        if(this.percentNumber<16.66){
            this.airQuality="优"
        }
        else if(this.percentNumber<33.33){
            this.airQuality="良"
        }
        else{
            this.airQuality="劣"
        }
    },

    onChange(){
        this.airNumber=this.aqi.aqi;
        this.PM10=this.aqi.PM10
        this.PM2_5=this.aqi.PM25
        this.NO2=this.aqi.NO2
        this.SO2=this.aqi.SO2
        this.CO=this.aqi.CO
        this.O3=this.aqi.O3
    }
}