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
                    <span>距离下期开奖还剩</span>
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
            <div class="divContent1" :style="{'background':'url('+animalBkImg  +')', 'background-size':'100% 100%'} ">
                
                <div class="divContent11">
                    <div class="divContent2"
                        v-for="(itemrow, indexrow) in showRow" 
                        :key="indexrow"  
                    >
                        <div class="divImgAnmal" 
                        v-for="(itemcol, indexcol) in showColumn" 
                        :key="indexcol"  
                        ref="refImgAnmal"
                        @click="changSelectIndex(pageInfo[indexrow*showColumn + indexcol], indexrow*showColumn + indexcol)"
                        >
                        <img   width="100%" :height="imgH"  class="imag" :src="pageInfo.length==0?'':curIndex==(indexrow*showColumn + indexcol) ?pageInfo[indexrow*showColumn + indexcol].image_selected : pageInfo[indexrow*showColumn + indexcol].image" alt="">
                        </div>
                    </div>
                </div>

            </div>
        </div>
        
        <div class="divSubmit" v-show="showSubmit">
            <div class="div71">
                    <div class="div711">
                            <img :src="curImg" width= "90px" height="80px" >
                    </div>
                    <div class="div712">
                            <div class="div7121">
                                    <span>{{titlestr}}</span>
                            </div>
                            <div class="div7122">
                                    <span>单价 ￥{{curPrice / 100}}</span>
                            </div>
                            <div class="div7123">
                                    <span>数量</span>
                                    <div class="div71231">
                                        <div class="div712311" @click="downNum">

                                        </div>
                                          <input class="inputNum" v-model="animalNum"  type="number" oninput="if(value.length>5)value=value.slice(0,5); if(value< 0)value=0;"/>
                                        <div class="div712313" @click="upNum">

                                        </div>
                                    </div>
                            </div>
                    </div>
            </div>
            <div class="div81">
                <div class="div811">
                    <span>总计</span>
                </div>
                <div class="div812">
                    <span>￥{{totalPrice}}</span>
                </div>
                <div class="div813">

                </div>
                <div class="div814">
                    <div class="div8141" @click="createOder">
                        <span>提交订单</span>
                    </div>
                </div>
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
                imgW:"0px",
                imgH:"0px",
                showRow:0,
                showColumn:0,
                animalBkImg:require('@/assets/img/bkColor.png'),
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

        created:function(){
            this.getRealRowColumn();
            this.getMarqueeInfo();
            this.getPageInfo();
            this.timer = setInterval(this.startTime, 1000);
        },
        methods:{
            getRealRowColumn(){
                let tmpValue = 10000;
                let realHeight = this.contentHeight - 290;
                let realWidth = this.contentWidth - 50;
                for(let col = 2; col < 7; col ++){
                    let row = 12 / col;

                    let tmpX = realWidth / col;
                    let tmpY = realHeight / row;

                    let value = Math.abs(tmpX - tmpY);
                    if(value < tmpValue){
                        this.showRow = row;
                        this.showColumn = col;
                        tmpValue = value;
                    }
                }
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
                // console.log(error);
                    setTimeout(() => {
                        getMarqueeInfo();
                    }, 100);
                })
            },
            getPageInfo(){
                this.$http.get('homepage/product_info', {
                            headers:{
                                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                            }
                         })
                .then((success) => {
                    this.imgw = this.$refs.refImgAnmal[0].clientWidth + "px";
                    this.imgH = this.$refs.refImgAnmal[0].offsetHeight  + "px";
                    // var pageInfo = success["prod_infos"];
                    this.pageInfo = success.data.prod_infos;

                    this.curImg = this.pageInfo[0].image_selected;
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

.divContent1{
    flex-grow: 1;
    width: 100%;
    margin: 10px;
    display: flex;
    
}
.divContent11{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin: 15px;
}
.divContent2{
     flex-grow: 1;
     display: flex;
     flex-direction: row;
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
.imag{
    flex-grow: 1;
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
    font-size: 13px;
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
    font-size: 13px;
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
    display: flex;
}

.div711{
    display: flex;
    width: 90px;
    height: 100px;
    justify-content:center;
    align-items: center;
    padding: 0px 0px 0px 10px;
}
.div712{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
}
.div7121{
    font-weight: bold;
    font-size: 18px;
    margin: 10px 0px 0px 20px;
}
.div7122{
    font-size: 15px;
    margin: 5px 0px 0px 10px;
}
.div7123{
    font-size: 15px;
    margin: 5px 0px 0px 10px;
    display: flex;
}
.div71231{
    display: flex;
}
.div712311{
    width: 18px;
    height: 18px;
    background: url("../../assets/img/leftBtn.png");
    background-size:100% 100%;
    margin: 2px 0px 0px 10px;
}

.div712313{
    width: 18px;
    height: 18px;
    background: url("../../assets/img/rightBtn.png");
    background-size:100% 100%;
    margin: 2px 0px 0px 5px;
}
.inputNum{
    width: 80px;
    height: 20px;
    border: none;
    text-align: center;
    margin-left: 5px;
    background-color: #f66a1f44;
    color: #f66a1f;
    
}
.div81{
    width: 100%;
    height: 50px;
    background:white;
    margin-top: 2px;
    display: flex;
}

.div811{
    width: 40px;
    height: 35px;
    margin: 15px 0px 00px 20px;
    vertical-align: bottom;
}

.div812{
    width: 80px;
    height: 35px;
    margin: 12px 0px 10px 00px;
    vertical-align: bottom;
    font-weight: bold;
    font-size: 20px;
    color: #CD1D1B;
}

.div813{
    flex-grow: 1;
}
.div814{
    display: flex;
    width: 180px;
    height: 50px;
    align-items: center;
    justify-content:center;
    vertical-align: middle;
    
}
.div8141{
    width: 150px;
    height: 35px;
    background-image: linear-gradient(146deg, #f6681e, #ffaa47);
    border-radius: 5px;
    font-weight: bold;
    color: #FFFFFF;
    text-align: center;
    line-height: 35px;
}
/deep/ .van-icon__image{
    width: 35px;
    height: 35px;
}
</style>