<template>
<van-tabbar v-model="active" :border=false>
  <van-tabbar-item :icon="pic1" >{{this.$t('home')}}</van-tabbar-item>
  <van-tabbar-item :icon="pic2" >{{this.$t('history')}}</van-tabbar-item>
  <van-tabbar-item :icon="pic3" >{{this.$t('mine')}}</van-tabbar-item>
</van-tabbar>
</template>

<script>
    export default {
        data() {
            return {
                active:0,
                
                homePic:require("@/assets/img/home.png"),
                historyPic:require("@/assets/img/history.png"),
                minePic:require("@/assets/img/mine.png"),
                homePicActive:require("@/assets/img/homeActive.png"),
                historyPicActive:require("@/assets/img/historyActive.png"),
                minePicActive:require("@/assets/img/mineActive.png"),
                pic1:require("@/assets/img/homeActive.png"),
                pic2:require("@/assets/img/history.png"),
                pic3:require("@/assets/img/mine.png"),
            }
        },
        watch:{
            active(newValue, oldValue){
                this.$emit("curPage", newValue); 
                this.pic1 = this.homePic;
                this.pic2 = this.historyPic;
                this.pic3 = this.minePic;

                if(this.active == 0){
                    this.pic1 = this.homePicActive;
                }
                else if(this.active == 1){
                    this.pic2 = this.historyPicActive;
                }
                else{
                    this.pic3 = this.minePicActive;
                }
            }
        }
    }
</script>

<style scoped>

/deep/ .van-tabbar-item {
    font-size: 14px;
}
/deep/ .van-tabbar-item__icon{
    margin-bottom: 7px;
}
</style>