<template>
    <div class="personRoot">

        <div class="head">
            <div class="leftArror"  >
                <img src="@/assets/img/leftArror.png" @click="clickItem" width="15px" height="15px" /> 
            </div>
             <div class="title"><span>个人信息</span></div>
        </div>
        <div class="divLogo">
            <div>
                <span>当前头像</span>
            </div>
            <div class="divCurImg">
                <van-image round :src="curUserImg"  @click="clickItem" width="60px" height="60px" /> 
            </div>
        </div>
        <div class="info">
            <!-- 输入任意文本 -->
            <van-field v-model="userName" label="用户名" :readonly="disableUserName" :right-icon="updateImg" @click-right-icon="updateNameFlag" />
            <!-- 输入手机号，调起手机号键盘 -->
            <van-field v-model="userPhone" type="tel" :readonly="disableUserPhone" label="手机号" :right-icon="updateImg" @click-right-icon="updatePhoneFlag" />
            
            <div class="chooseAvatar">
                <div class="txtAvatar">
                    <span>头像列表</span>
                </div>
                <div class="avatar" ref='refrence'>
                    <van-grid  :border="false" :column-num="4">
                    <div  v-for="(item, index) in avatarlist" :key="index" :style="item.style" @click="changSelectIndex(item, index) ">
                        <van-grid-item >
                            <van-image round :src="item.avatar_url" :width=getImgWidth() :height=getImgHeight()  />
                        </van-grid-item>

                    </div>
                    
                    </van-grid>
                </div>
            </div>
            <div class="divsave">
                <van-button type="primary" round size="large" @click="clickBtn">保存</van-button>
            </div> 
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    export default {
        props:['contentHeight', 'contentWidth'],
        data(){
            return{
                selectImgId:-1,
                checkStyle:"padding:5px;border:1px solid #ddd ",
                uncheckStyle:"padding:5px;border:1px solid white ",
                tmpObj:null,
                avatarlist:[],
                disableUserName:true,
                disableUserPhone:true,
                userName:"一级赌徒",
                userPhone:"130000000000",
                userImg:"",
                curUserImg:"",
                updateFlag : true,
                updateImg:require("@/assets/img/updateTitle.png")
            }
        },
        methods:{
            changSelectIndex(item, index){
                if(this.tmpObj != null){
                    this.tmpObj.style = this.uncheckStyle;
                }
                this.updateFlag = true;
                item.style = this.checkStyle;
                this.tmpObj = item;
                this.userImg = item.avatar_url
                this.selectImgId = item.avatar_id;
                this.$set(this.avatarlist, index, item);

            },
            getImgHeight(){
                return (this.contentWidth) / 4 - 20 - 10;
            },
            getImgWidth(){
                return (this.contentWidth) / 4 - 20 - 10;        
            },
            getavatarlist(){
            this.$http.get('user_center/avatar_list', {
                        headers:{
                            'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                        }
                        })
            .then((success) => {
                console.log(success)
                this.avatarlist = success.data.avatar
                this.avatarlist.forEach(element => {
                    element.style = this.uncheckStyle;
                });
            }, (error) => {
                console.log(error);
            })
            },
            setUserInfo(){
                this.$http.post('user_center/set_user_info', 
                this.$qs.stringify({nick_name:this.userName, phone:this.userPhone, avatar_id:this.selectImgId, openid: this.$store.state.openId}),
                {
                    headers:{
                    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                    } 
                })
                .then((success) => {
                    this.$store.commit("setNickName", this.userName);
                    this.$store.commit("setUserImg", this.userImg);
                    this.$emit("curPage", 2); 
                }, (error) => {
                    console.log(error);
                })
            },  
            clickBtn(){
                if(!this.updateFlag){
                    return;
                }
                this.setUserInfo();
                this.updateFlag = false;
                this.disableUserName = true;
                this.disableUserPhone = true;
            },
            updatePhoneFlag(){
                this.updateFlag = true;
                this.disableUserPhone = !this.disableUserPhone;
            },
            updateNameFlag(){
                this.updateFlag = true;
                this.disableUserName = !this.disableUserName;
            },
            clickItem(){
                this.$emit("curPage", 2); 
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
                    this.curUserImg = success.data.user_info.f_avatar;
                    this.userImg = success.data.user_info.f_avatar;
                    this.userName = success.data.user_info.f_nick_name;
                    this.userPhone = success.data.user_info.f_phone;
                }, (error) => {
                })
            },
            
        },
        created(){
            this.getUserInfo();  
            this.getavatarlist();        
        },
    }
</script>

<style scoped>
.personRoot{
    display: inline-block; 
    background:#ddd 
}
.head{
    width: 100%;
    height: 55px;
    display: inline-block;
    background:white
}
.leftArror{
    position: absolute;
    height: 15px;
    width: 50px;
    float: left;
    padding: 20px;
}
.title{
    width: 100;
    height: 55px;
    text-align: center;
    font-weight:bold;
    line-height: 55px;
    font-size: 22px;

}
.divsave{
    display: block;
    margin-top: 40px;
    margin-left: 20px;
    margin-right: 20px;
}

.chooseAvatar{
    padding: 20px;
    background:white;
     margin-top: 10px;
}
.txtAvatar{
    padding: 0px 0px 20px 0px;
    color:#646566;
    font-size: 18px;
}
.divCurImg{
    margin-left: 40px;
}
.divLogo{
    padding: 10px 20px 20px 16px;
    display: flex;
    height: 50px;
    line-height: 50px;
    color: "#646566";
    vertical-align:middle;
    font-size: 18px;
    margin-top: 10px;
    background:white
}
.divspace{
    display: inline-block; 
    background:#eee; 
}
/deep/ .van-cell{
    font-size: 18px;
    vertical-align:middle;
}
/deep/ .van-grid-item__content{
            padding: 0px;
        }

/deep/ .van-row{
        width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>