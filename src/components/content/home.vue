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
            <div class="divTop31" v-show="next_lottery_txt == 0">
                <div class="spane31">
                    <span>距离下次开奖还剩</span>
                </div>
                <div class="spane32" >
                    <span class="spane321">{{lottery_txt_minute}}</span>         
                </div>
                <div>
                    <span class="spane33">分</span>
                </div>
                    
                <div class="spane32" >
                    <span class="spane321">{{lottery_txt_secode}}</span>          
                </div>
                <div class="spane33">
                    <span > 秒</span>
                </div>
            </div>

            <div class="divTop51" v-show="next_lottery_txt == 1">
                <div class="divTop52">
                    <span>即将开奖</span>
                </div>
            </div>

        </div>
            <div class="divTop41"> 
                    <van-notice-bar speed="20"  background="white" color="#000" :left-icon="laba" :text="marqueemessage" />
            </div>
        <div class="divShowAnimalImg" >
            <div class="divContent1">
                <div class="divContent2">
                <div class="divContent11">
                    <div class="divImgAnmal" v-for="(item, index) in 3" 
                    :key="index"  
                    v-bind:style="[{backgroundImage:pageInfo.length == 0?'': curIndex== index ? 'url('+ getbkUrl(1, pageInfo[index].id) +')' : 'url('+ getbkUrl(0, pageInfo[index].id) +')'}]" 
                    @click="changSelectIndex(pageInfo[index], index)"
                    >
                    </div>
                </div>
                <div class="divContent11">
                    <div class="divImgAnmal" v-for="(item, index) in 3" 
                    :key="index" 
                    v-bind:style="[{backgroundImage:pageInfo.length == 0?'': curIndex==(index + 3)? 'url('+ getbkUrl(1, pageInfo[index + 3].id) +')' : 'url('+ getbkUrl(0, pageInfo[index + 3].id) +')'}]" 
                    @click="changSelectIndex(pageInfo[index + 3], index + 3)"
                    >
                    </div>
                </div>
                <div class="divContent11">
                    <div class="divImgAnmal" v-for="(item, index) in 3" 
                    :key="index" 
                    v-bind:style="[{backgroundImage:pageInfo.length == 0?'': curIndex== (index + 6)? 'url('+ getbkUrl(1, pageInfo[index + 6].id) +')' : 'url('+ getbkUrl(0, pageInfo[index + 6].id) +')'}]" 
                    @click="changSelectIndex(pageInfo[index + 6], index + 6)"
                    >
                    </div>
                </div>
                <div class="divContent11">
                    <div class="divImgAnmal" v-for="(item, index) in 3" 
                    :key="index" 
                    v-bind:style="[{backgroundImage:pageInfo.length == 0?'': curIndex== (index + 9)? 'url('+ getbkUrl(1, pageInfo[index + 9].id) +')' : 'url('+ getbkUrl(0, pageInfo[index + 9].id) +')'}]" 
                    @click="changSelectIndex(pageInfo[index + 9], index + 9)"
                    >
                    </div>
                </div>
                </div>

            </div>
        </div>
        
        <div class="divSubmit" v-show="showSubmit">
            <div class="div71">
                    <div class="div711">
                            
                    </div>
            </div>
            <div class="div81">

            </div>
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
                next_lottery_txt:0,
                lottery_txt_minute:"0",
                lottery_txt_secode:"0",
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
            getbkUrl(type, index){
                if(type == 0){
                    return require("@/assets/img/"+ index+".png");
                }
                return require("@/assets/img/"+ index+"_Hover.png");
            },
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
                    console.log(success)
                    // var pageInfo = success["prod_infos"];
                    this.pageInfo = success.data.prod_infos;

                    this.curImg = this.pageInfo[0].image;
                     this.titlestr = "生肖：" + this.pageInfo[0].name;
                     this.curId = this.pageInfo[0].id;
                    // console.log(this.pageInfo);
                }, (error) => {
                    console.log(error);
                })
            },
            getImgHeight(){
                return (this.contentHeight - 500) / 4;
            },
            getImgWidth(){
                return (this.contentWidth - 40) / 3 - 20;        
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
                    this.curImg = item.image_selected;
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
                    this.next_lottery_txt = 1;
                    return;
                }
                else if(this.next_lottery_left <= -10 * 500){
                    if(this.bGetLottert){
                        this.getMarqueeInfo();
                        this.bGetLottert = false;
                    }
                    this.next_lottery_txt = 1; 
                }
                else{
                    this.next_lottery_txt = 0;
                    this.lottery_txt_minute = moment(this.next_lottery_left).format('mm');
                    this.lottery_txt_secode = moment(this.next_lottery_left).format('ss');
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
    background:#F7F7F7;
    font-family: sans-serif; 
}
.dviShowPreAnimal{
    width: 100%;
    height: 180px;
    background:white;
    display: block;
    background-image: linear-gradient(166deg, #f6681e, #fea544);
}
.divShowAnimalImg{
    width: 100%;
    flex-grow: 1;
    margin-top: 8px;
    margin-bottom: 2px;
    background:white;
    display: flex;
    
}
.divContent11{
    flex-grow: 1;
    display: flex;
    flex-direction: row;
}
.divContent1{
    flex-grow: 1;
    width: 100%;
    background-color: yellow;
    margin: 10px;
    display: flex;
    background: url("../../assets/img/bkColor.png");
    background-size:100% 100%
}
.divContent2{
     margin: 15px;
     flex-grow: 1;
     display: flex;
     flex-direction: column;
}

.divImgAnmal{
    display: flex;
    flex-grow: 1;
    margin: 2px 2px 2px 2px;
    background-size:100% 100%;
    border: none;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
}

.divTop1{
    height: 40px;
    display: flex;
    flex-direction: row;
}
.divTop11{
    width: 30px;
    display:flex;
    align-items:flex-end;
    text-align: right;
    font-size: 10px;
    color: #fafafa;
    padding: 0px 0px 0px 20px;
}
.divTop12{
    width: 90px;
    font-size: 16px;
    display:flex;
    color: #fafafa;
    align-items:flex-end;
    font-weight: bold;
    
}
.divTop13{
    font-size: 10px;
    display:flex;
    color: #fafafa;
    align-items:flex-end;
}
.divTop22{
    position: absolute;
    right: 0;
    top: 15px;
    width: 40px;
    height: 45px;
    font-size: 15px;
    text-align: center;
    background:#ffffff88;
    border-radius: 20% 00% 00% 20%;
    color: #f77023;
    padding: 10px;
    
}
.divTop21{
    width: 80px;
    color: #F7F7F7;
    align-items:flex-end;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-weight: bold;
    font-size: 15px;
    border: 1px solid #F7F7F7;
    border-radius: 7%;
    margin: 10px 0px 0px 20px;
    
}
.divTop31{
    width: 100%;
    height: 80px;
    margin-top: 20px;
    background:#ffffff;
    border-radius: 15px 15px 0% 00%;
    line-height: 80px;
    text-align: left;
    font-weight: bold;
    display: flex;
}

.divTop51{
    width: 100%;
    height: 80px;
    margin-top: 20px;
    line-height: 80px;
    text-align: center;
    background:#ffffff;
    align-items: center;
    color: #F7F7F7;
    display: flex;
    justify-content:center
}

.divTop52{
    width: 200px;
    height: 40px;
    border-radius: 5px;
    line-height: 40px;
    background-image: linear-gradient(146deg, #f6681e, #ffaa47);
}

.spane31{
    margin-left: 20px;
    padding: 0px 10px 0px 0px;
    
}
.spane32{
    display: block;
    width: 26px;
    height: 30px;
    font-size: 14px;
    font-weight: normal;
    line-height: 30px;
    color: #F6681E;
    text-align: center;
    background-color:#fdf3d7;
    margin: 25px 3px 0px 3px;
}
.spane33{
    font-weight: normal;
    color: #737373;
   
}
.divTop41{
    margin: 8px 0px 0px 0px;
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
    background:#F7F7F7;

}
.div71{
    width: 100%;
    height: 100px;
    background:white;
    display: inline-block;
}
.div81{
    width: 100%;
    height: 50px;
    background:white;
    margin-top: 2px;
}

/deep/ .van-icon__image{
    width: 35px;
    height: 35px;
}
</style>