<template>
    <div class="mineRoot">
        <div class="head">
                <div class="divImg">
                    <van-image round width="5rem" height="5rem" :src = this.$store.state.userImg />
                </div>
                 <div class="divUserName">
                     <div>
                    <h2 class="pNickName">{{this.$store.state.nickName}}</h2>
                    <div class="spanUserLevel">
                        <span >{{this.userLevel}}</span>       
                    </div>
                     </div>
                 </div>
                 <div class="divSecret">
                    <img src="@/assets/img/rightArror.png" width="15px" height="15px" @click="clickItem(5)">        
                 </div>
        </div>
        <div class="divContent">
            <van-list
            finished-text="没有更多了"
            >
            <van-cell v-for="(item, index) in listContent" :key="index" :icon="item.icon" :title="item.text"  @click="clickItem(item.pageIndex)">
                <div class="rightAroor" v-show="item.showIcon">
                    <img src="@/assets/img/rightArror.png" width="15px" height="15px">
                </div>
            </van-cell>
            </van-list>
        </div>

        <div class="divAbout">
            <van-list
            finished-text="没有更多了"
            >
            
            <van-cell v-for="(item, index) in listAbout" :key="index" :icon="item.icon" :title="item.text"  @click="clickItem(item.pageIndex)">
                <div class="rightAroor" v-show="item.showIcon">
                    <img src="@/assets/img/rightArror.png" width="15px" height="15px">
                </div>
            </van-cell>
            </van-list>
        </div>

    </div>
</template>

<script>
import moment from 'moment'

export default {
    props:['contentHeight', 'contentWidth'],
    data(){
        return{
            aboutUs:"",
            aboutAct:"",
            rightAroor: require('@/assets/img/rightArror.png'),
            userImg:"https://img.yzcdn.cn/vant/cat.jpeg",
            userName:"请设置昵称",
            userLevel:"一级赌徒",
            listContent:[
            {text:"我的投注记录", pageIndex:3, showIcon:true, icon:require("@/assets/img/record.png")}, 
            {text:"我的中奖记录", pageIndex:4, showIcon:true, icon:require("@/assets/img/winner.png")}, 

            ],
            listAbout:[            
                {text:"关于活动", pageIndex:6, showIcon:false, icon:require("@/assets/img/aboutAct.png")},
                {text:"关于我们", pageIndex:7, showIcon:false, icon:require("@/assets/img/aboutUs.png")}],
        }
    },
    methods:{
        getShowPic(){
            console.log(this.$store.state.userImg)
            return require("" + this.$store.state.userImg);

        },
        getAboatAct(){
            if(this.aboutAct != ""){
                this.showPlan(this.aboutAct)
                return;
            }
            this.$http.get('user_center/about_act', {
                        headers:{
                            'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                        }
                        })
            .then((success) => {
                this.aboutAct = success.data.about_act;
                this.showPlan(this.aboutAct)
            }, (error) => {
                console.log(error);
            })
        }, 
        getAboatUs(){
            if(this.aboutUs != ""){
                this.showPlan(this.aboutUs)
                return;
            }
            this.$http.get('user_center/about_us', {
                        headers:{
                            'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                        }
                        })
            .then((success) => {
                this.aboutUs = success.data.about_us;
                this.showPlan(this.aboutUs)
            }, (error) => {
                console.log(error);
            })
        },         
        showPlan(text){
            this.$dialog.alert({
            title: '跑马灯玩法',
            message: text,
            });
        },
        getReuireImg(url){
            return require("" + url);
        },
        clickItem(index){
            if(index == 6){
                this.getAboatAct();        
            }
            else if(index == 7){
                this.getAboatUs();
            }
            else{
                this.$emit("curPage", index);         
            }
            
        },
       
        getUserInfo(){
            this.$http.get('user_center/get_user_info',
            {
                params: {
                  openid: this.$store.state.openId
                },
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                } 
            }
            ).then((success) => {
                this.userLevel = success.data.user_info.f_level;
                this.userImg = success.data.user_info.f_avatar;
                this.userName = success.data.user_info.f_nick_name;
                this.$store.commit("setNickName", this.userName);
                this.$store.commit("setUserImg", this.userImg);
            }, (error) => {
        })
    },
    },
    created(){
        this.getUserInfo();
    }

}
</script>

<style scoped>
.mineRoot{    
    width: 100%;
    display: inline-block; 
    background:#eee 
}
.head{
    width: 100%;
    height: 130px;
    background:white
}
.divContent{
    background:white;
    margin-top: 20px;
}
.divAbout{
    background:white;
    margin-top: 20px; 
}
.divImg{
    float: left;
    margin-left: 20px;
    margin-top: 25px;
}
.divUserName{
    float: left;
    margin-top: 40px;
}

.pNickName{
    line-height: 20px;
    padding: 0px;
    margin: 0px 0px 0px 20px;
    font-size: 20px;
}
.spanUserLevel{
    color:#646566;
    font-size: 15px;
    margin: 15px 0px 0px 20px;
}

.rightAroor{
    float: right;
    margin-right: 10px;
    
}
.updateTitle{
    float: left;
    display: block;
    margin-top: 18px;
    margin-left: 5px;
}
.divSecret{
    float:right;
    margin-top: 78px;
    margin-right: 30px;
}
.divdsImg{
    padding: 10px;
}
/deep/ .van-cell{
    height: 60px;
    font-size: 18px;
    padding: 20px;
}
/deep/ .van-cell:active{

background-color: darkgray;
}
.van-icon__image{
    width:40px;
    height: 20px;
}
</style>