export default {
    props:['otherData'],
    data:{},

    onInit(){
        this.$watch('otherData','onChange')
    },

    onChange(){
        console.info(this.otherData.rh+","+this.otherData.feel_like+","+
           this.otherData.uv+","+this.otherData.pressure)
    }
}