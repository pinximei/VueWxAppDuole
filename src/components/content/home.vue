<template>  
    <div class="root">

        <div class="dviShowPreAnimal">
            <div class="divTop1">
                <div class="divTop11">
                    <span>上期</span>
                </div>
                <div class="divTop12">
                   <span>第 {{latest_term}} 期</span>     
                </div>
                <div class="divTop13">
                   <span>{{last_lottery_time}}</span>     
                </div>
            </div>
            <div class="divTop21">
                <span>{{latest_animal}}</span>
            </div>
            <div class="divTop22">
                    <span>上期开奖</span>
            </div>
            <div class="divTop31">
                    <span>距离下次开奖还剩</span>
            </div>
            <div class="divTop32">
                    <span>{{next_lottery_txt}}</span>
            </div>
            <div class="divTop41"> 
                    <van-notice-bar speed="20"  background="white" color="#ff0000" :left-icon="laba" :text="marqueemessage" />
            </div>
        </div>

        <div class="divShowAnimalImg" >
            <div class="divB11" v-if="false">
                    <span>开始投注</span>
            </div>
            <div>
                <van-grid :column-num="3" :border="false">
                    <van-grid-item  v-for="(item, index) in pageInfo[0]" :key="index">
                        <div class="divShowImg" :style="{'background':curIndex==index?'lightgray':'white'}" @click="changSelectIndex(item, index)">
                            <van-image :src="item.image" :width=getImgWidth() :height=getImgHeight() />       
                        </div>
                        
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
        
        <div class="divSubmit" v-show="showSubmit">
            <van-card
            :thumb="curImg"
            >
            <template #title>
                <div class="divdstxt">
                    <div class="divdsName">
                        <span>单价 ￥{{curPrice / 100}}</span>
                    </div>
                    <div class="disvdsnum">
                        <span>数量</span>
                        <div class="divdsinput">
                                <input v-model="animalNum"  type="number" oninput="if(value.length>5)value=value.slice(0,5); if(value< 0)value=0;"/>
                        </div>
                        <div class="divdsarrow">
                            <div class="divupimg">
                                <img class="diviimg" :src="upA" width="20px" height="20px" @click="upNum">
                            </div>
                            <div class="divdownimg">
                                <img class="diviimg" :src="dounA" width="20px" height="20px" @click="downNum" >
                            </div>
                            
                        </div>
                    </div>
                    <div class="divdsbt">
                        <div class="divdsbttxt"> 
                                <span>总计:</span>      
                                <span class="spanred">￥{{totalPrice}}</span>
                            </div>
                            
                        
                        <div class="divdsbtSubmitBtn">
                            <van-button round type="primary" color="red" @click="createOder">提交订单</van-button>
                        </div>
                            
                        </div>
                </div>
            </template>
            </van-card>
        </div>
        
    </div>


</template>

<script>
    import moment from 'moment'
    export default {
        props:['contentHeight', 'contentWidth', 'showPageIndex'],
        data() {
            return {
                upA:require("@/assets/img/upA.png"),
                dounA:require("@/assets/img/dounA.png"),
                animalNum:"1",
                showSubmit:false,
                curIndex:-1,
                laba:require('@/assets/img/laba.png'),
                last_lottery_time:"",
                latest_term:"",
                latest_animal:"",
                pageInfo:[],
                timer:null,
                titlestr:"",
                message:"",
                marqueemessage:"",
                curImg:'1.jpg',
                inputNum:1,
                rstData:"1234",
                next_lottery_left:10*60*60,
                next_lottery_txt:"",
                curId:0,
                bGetLottert:true,
                timer:'',
                totalPrice:0,
                curPrice:0,
            }
        },

        mounted:function(){
            this.getMarqueeInfo();
            this.getPageInfo();
            this.timer = setInterval(this.startTime, 1000);
        },
        methods:{
            downNum(){
                let num = parseInt(this.animalNum);
                if(num == 1){
                    return;
                }
                num --;
                this.animalNum = String(num);
            },
            upNum(){
                let num = parseInt(this.animalNum);
                num ++;
                this.animalNum = String(num);
            },
            formatDate(value) {
                return moment(value*1000).format('YYYY-MM-DD HH:mm:ss')
            },
            getMarqueeInfo(){
                this.$http.get('homepage/marquee_info',{
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                    } 
                    })
                .then((success) => {
                    
                    this.last_lottery_time = this.formatDate(success.data.last_lottery_time );
                    this.latest_term = success.data.last_term;
                    this.latest_animal = success.data.last_animal;
                    this.next_lottery_left = success.data.next_lottery_left * 1000; 
                    this.marqueemessage = "";
                    success.data.winning_infos.forEach(element => {
                        this.marqueemessage +=  "恭喜 " + element ;
                        this.marqueemessage +="     "
                    });
                    this.message = this.marqueemessage;
                    this.$store.commit("setUpdateHistory", true);

                }, (error) => {
                console.log(error);
                })
            },
            getPageInfo(){
                this.$http.get('homepage/product_info', {
                            headers:{
                                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                            }
                         })
                .then((success) => {
                    // var pageInfo = success["prod_infos"];
                    this.$set(this.pageInfo, 0, success.data.prod_infos); 
                    this.curImg = this.pageInfo[0][0].image;
                     this.titlestr = "生肖：" + this.pageInfo[0][0].name;
                     this.curId = this.pageInfo[0][0].id;
                    // console.log(this.pageInfo);
                }, (error) => {
                    console.log(error);
                })
            },
            getImgHeight(){
                return (this.contentHeight - 330) / 4;
            },
            getImgWidth(){
                return (this.contentWidth) / 3 - 20;        
            },
            changSelectIndex(item, index){
                if(this.curIndex == index){
                    this.curIndex = -1;
                    this.showSubmit = false;
                }
                else{
                    this.inputNum = 1;
                    this.animalNum = "1";
                    this.showSubmit = true;
                    this.curImg = item.image;
                    this.curId = item.id;
                    this.titlestr = item.name;
                    this.curIndex = index;
                    this.curPrice = item.price;
                    this.totalPrice = String(this.curPrice /100);
                }

            },
            createOder(){
                    if(this.inputNum == 0){
                        return;
                    }
                    this.$http.post('order/create_order', 
                   this.$qs.stringify({prod_id: this.curId, buy_cnt:parseInt(this.inputNum),openid: this.$store.state.openId}) ,
                    {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    }
                    }).then((success) => {
                        this.curIndex = -1;
                        this.showSubmit = false;
                        this.sendPost(success.data.prepay_id);
                        this.$store.commit("reportLog", this.$store.state.message );
                    }, (error) => {
                        this.$store.commit("reportLog", "createOder error");
                    })

            },
            sendPost(prepayid){
                 var timestamp = Date.parse(new Date());

                var stringA = "appId=wxbe68382a9463a04e&nonceStr=e61463ffbbb444&package=prepay_id=" + prepayid + "&signType=MD5&timeStamp="
                + String(timestamp)+ "&key=0123456789abcdefghijklmnopqrstuv";
                var tmpString = this.$md5(stringA).toUpperCase();
                WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId":"wxbe68382a9463a04e",     //公众号名称，由商户传入     
                    "timeStamp":String(timestamp),         //时间戳，自1970年以来的秒数     
                    "nonceStr":"e61463ffbbb444", //随机串     
                    "package":"prepay_id=" + prepayid,     
                    "signType":"MD5",         //微信签名方式：     
                    "paySign":tmpString //微信签名 
                },
                function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        this.rstData = err_msg;
                    } 
                    else{
                        this.$store.commit("reportLog", "getBrandWCPayRequest:" + res.err_msg );
                    }
            }); 

            },
            startTime(){
                this.next_lottery_left -= 1000;
                if(this.next_lottery_left <= 0 && this.next_lottery_left > -10 * 500){
                    this.bGetLottert = true;
                    this.next_lottery_txt = "即将开奖";
                    return;
                }
                else if(this.next_lottery_left <= -10 * 500){
                    if(this.bGetLottert){
                        this.getMarqueeInfo();
                        this.bGetLottert = false;
                    }
                    this.next_lottery_txt = "即将开奖"; 
                }
                else{
                    this.next_lottery_txt = moment(this.next_lottery_left).format('mm分ss秒');
                }
                        
            }
            
        },
        watch:{
            animalNum(newValue, oldValue){
                
                if(newValue==""){
                    this.inputNum = 0;
                    this.totalPrice = 0;
                }
                else{
                    let num = parseInt(newValue);
                    this.inputNum = num;
                    this.totalPrice = String(num * this.curPrice / 100);
                }
            },
            showPageIndex(newValue, oldValue){
                if(newValue == 0){
                    this.marqueemessage = "";
                    setTimeout(() => {
                        this.marqueemessage = this.message;
                    }, 50);
                }        
            }
        },
        beforeDestroy(){
            clearTimeout(this.timer);
        },
    }
</script>

<style scoped>
.root{
    width: 100%;
    display:flex;
    flex-direction: column;
    background:#eee 
}
.dviShowPreAnimal{
    width: 100%;
    height: 200px;
    background:white;
    display: block;
}
.divShowAnimalImg{
    width: 100%;
    flex-grow: 1;
    margin-top: 10px;
    margin-bottom: 10px;
    background:white
}
.divTop1{
    height: 40px;
    display: flex;
    flex-direction: row;
}
.divTop11{
    width: 40px;
    display:flex;
    align-items:flex-end;
    text-align: right;
    font-size: 10px;
    padding: 0px 0px 0px 20px;
}
.divTop12{
    width: 100px;
    font-size: 18px;
    display:flex;
    align-items:flex-end;
    font-weight: bold;
    
}
.divTop13{
    font-size: 10px;
    display:flex;
    align-items:flex-end;
    color: gray;
}
.divTop22{
    position: absolute;
    right: 0;
    top: 10px;
    width: 40px;
    height: 40px;
    font-size: 15px;
    text-align: center;
    background:#f9012d;
    border-radius: 20% 00% 00% 20%;
    color: white;
    padding: 10px;
}
.divTop21{
    width: 100%;
    color: red;
    align-items:flex-end;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
}
.divTop31{
    margin-left: 20px;
}
.divTop32{
    width: 100%;
    height: 50px;
    line-height: 50px;
    align-items: center;
    text-align: center;
    font-weight: bold;
}
.divB11{
    width: 100%;
    padding: 10px 00px 20px 20px;
    font-weight: bold;
}

.divShowImg{
    padding: 10px;
    border: none;
}
.divSubmit{
    position: absolute;
    width: 100%;
    bottom: 0px;
    z-index: 100;
}
.divdstxt{
    margin-left: 5px;
}
.divdsName{

    padding: 0px 0px 10px 0px;
} 
.disvdsnum{
    display: flex;
    height: 35px;
    line-height: 35px;
    vertical-align: middle;
}
.divdsinput{
    width: 30px;
    height: 35px;
    padding: 0px 0px 0px 10px;
    font-size: 15px;
    text-align: center;
}
input{
    width: 60px;
    height: 30px;
} 

.divdsarrow{
    margin-left: 40px;
    width: 20px;
    height: 35px;
    display: flex;
    flex-direction: column;
}
.divupimg{
    width: 15px;
    height: 15px;
    border: 1px solid;
    padding: 0px;
    display: block;
}
.divupimg:active{
    background: lightgray;
}
.divdownimg{
    width: 15px;
    height: 15px;
    border: 1px solid;
    margin-top: 2px;
    padding: 0px;
    display: block;
    
}
image{
    padding: 0px;
}
.divdownimg:active{
    background: lightgray;
}
.divdsbt{
    float: right;
    height: 45px;
    display: flex;
}
.divdsbttxt{
    width: 130px;
    padding: 20px 0px 0px 0px;
    font-size: 18px;
    font-weight: bold;
}
.divdsbtSubmitBtn{
    margin-top: 5px;
}
.spanred{
    color: red;
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