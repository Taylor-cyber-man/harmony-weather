import router from '@system.router';

export default {
    props:['path'],
    data:{
        title:"",
    },

    onInit(){
        this.title="北京";
        this.onChange();
        this.$watch('path','onChange');
    },

    onChange(){
        this.title=this.path;
    },
    
    openCitySelector() {
        router.push({
            uri: 'pages/citySelector/citySelector'
        });
    }

}