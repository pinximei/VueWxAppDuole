<template>
  <div >
    <div class="app" v-show="showIndex < 3">
    <div class="app-content" :style="{height:conheight.height}" >
        <homeComp    v-show="showIndex == 0" :showPageIndex="showIndex" :contentHeight="realContentHeight" :contentWidth="realContentWidth"></homeComp>
        <historyComp v-show="showIndex == 1" :showPageIndex="showIndex" :contentHeight="realContentHeight" :contentWidth="realContentWidth"></historyComp>
        <mineComp  @curPage="indexChange" v-show="showIndex == 2"  :contentHeight="realContentHeight" :contentWidth="realContentWidth"></mineComp>
        
    </div>
    <div class="app-footer">
        <footerComp  @curPage="indexChange"></footerComp>
        <!-- <p>{{this.$store.state.message}}</p> -->
    </div>
    </div>
    <div class="allRecordInfo"  v-if="showIndex == 3" > 
      <allRecordInfo @curPage="indexChange" :style="{'height':realContentHeight + 70 + 'px'}" :contentHeight="realContentHeight" :contentWidth="realContentWidth"></allRecordInfo>
      
    </div>
    <div class="winnerRecordInfo"  v-if="showIndex == 4" > 
        <winnerRecordInfo @curPage="indexChange" :style="{'height':realContentHeight + 70 + 'px'}" :contentHeight="realContentHeight" :contentWidth="realContentWidth"></winnerRecordInfo>
    </div>
    <div class="personInfo"  v-if="showIndex == 5" > 
        <personInfo @curPage="indexChange" :style="{'height':realContentHeight + 70 + 'px'}" :contentHeight="realContentHeight" :contentWidth="realContentWidth"></personInfo>
    </div>
  </div>
</template>

<script>
  import footerComp from "./components/footer/footer.vue"
  import homeComp from "./components/content/home.vue"
  import mineComp from "./components/content/mine.vue"
  import historyComp from "./components/content/history.vue"
  import allRecordInfo from './components/content/allRecordInfo.vue';
  import winnerRecordInfo from './components/content/winnerRecordInfo.vue';
  import personInfo from './components/content/personInfo.vue';


  export default {
    components:{
      footerComp,
      homeComp,
      mineComp,
      historyComp,
      allRecordInfo,
      winnerRecordInfo,
      personInfo
      },
      data() {
          return {
            showIndex:0,
            realContentWidth:100,
            realContentHeight:100,
            windowHight:"100px",
            conheight:{
                height:'',
                width:''
            }
          }
      },
      methods:{
        getOpenId(){
            this.$http.get('homepage/user_account', 
            {
              params: {
                  code: this.$store.state.code
                },
               headers:{
                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
              }  
            }
            )
            .then((success) => {
                this.$store.state.message += "openid" + success.data.openid;
                this.$store.commit("setOpenId", success.data.openid);
                this.$store.commit("reportLog", "getOpenId success");
            }, (error) => {
                this.$store.commit("reportLog", "getOpenId error");
            })
        },
        getUrlKey(name,url){
        　　return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null

        },
        getHeight(){
          this.conheight.height=window.innerHeight-70+'px';
          this.conheight.width=window.innerWidth+'px';
          this.realContentHeight = window.innerHeight-70
          this.realContentWidth = window.innerWidth;
        },
        indexChange(newValue){
            this.showIndex = newValue
            console.log(this.showIndex)
        }
      },
      created(){
        
        this.$store.commit("setCode", this.getUrlKey("code",  window.location.href));
        this.$store.state.message += "code" + this.getUrlKey("code",  window.location.href);
        window.addEventListener('resize', this.getHeight);
        this.getHeight()
        this.getOpenId();
     },
  }
</script>

<style scoped>
.app{
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction: column;
    padding: 0;
}
.app-content {
    width: 100%;
    flex-grow:1;
    display:flex;
}
.app-footer {
    width: 100%;
    height: 70px;
}

/deep/ .van-tabbar{
height: 70px;
}
/deep/ .van-tabbar-item__icon{
    margin-bottom: 10px;
}
/deep/ .van-tabbar-item{
  font-size: 16px;
}
</style>