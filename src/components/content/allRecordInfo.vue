<template>
    <div class="allRecordRoot">
        <div class="head">
            <div class="leftArror"  >
                <img src="@/assets/img/leftArror.png" @click="clickItem" width="15px" height="15px"> 
            </div>
             <div class="title"><span>我的投注记录</span></div>
        </div>
        <div class="allRecord">

                <div class="divRow"  v-for="(item, index) in allRecoderData" :key="index">
                    <div class="divRowHead">
                        <div class="divImag">
                            <img src="@/assets/img/recordCom.png" @click="clickItem" width="20px" height="20px"> 
                        </div>
                        <div class="divTermId">
                            <span >第{{item.f_term_id}}期</span>        
                        </div>
                        <div class="divWinnerStatue">
                            <span :style="{'color':item.f_winning_status==1?'#000':'#f00'}">{{item.f_win_animal_name | formStatue}}</span>
                        </div>
                        <div class="divAnimalName">
                            <span>投注生肖：{{item.f_buy_animal_name}}</span>
                        </div>

                    </div>
                    <div class="divRowContent">
                        <div class="divPrice">
                            <span>投注金额:{{(item.f_pay_price) | formPrice}}</span>         
                        </div>
                        <div class="divBuyCnt">
                            <span>投注数:{{(item.f_buy_cnt)}}注</span>
                        </div>
                        <div class="divCreateTime">
                            <span>投注时间:{{(item.f_create_time) | formatDate}}</span>
                        </div>
                    </div>
                </div>
            <div class="divPageCount" v-show="page_cnt != 1">
                <van-pagination v-model="currentPage" :page-count="page_cnt" mode="simple" @change="pageIndexInfo" />
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
                currentPage: 1,
                allRecoderData:[],
                allRecoderIndex:0,
                allRecoderHaveNextPage:1,
                pageNumCount:6,
                page_cnt:0
            }
        },
        methods:{
            clickItem(){
                this.$emit("curPage", 2); 
            },
            pageIndexInfo(){
                this.getAllRecord(this.currentPage - 1, this.pageNumCount);        
            },
            getAllRecord(index , num){
                this.$http.post('user_center/buy_records', 
                this.$qs.stringify({start:index, page_size:num,openid: this.$store.state.openId}),
                {
                    headers:{
                    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                    } 
                })
                .then((success) => {
                    this.page_cnt = success.data.page_cnt;
                    this.allRecoderData = success.data.records;
                    this.allRecoderHaveNextPage = (this.allRecoderIndex + 1) < this.page_cnt;
                }, (error) => {
                    console.log(error);
                })
            },
            getRealTableCount(){
                this.pageNumCount = parseInt((this.contentHeight - 60) / 98);
            },
        },
        created(){
            this.getRealTableCount();
            this.getAllRecord(this.allRecoderIndex, this.pageNumCount);            
        },
        filters: {
            formatDate: function (value) {
            return moment(value*1000).format('YYYY-MM-DD HH:mm:ss')
            },
            formStatue:function(vaule){
                return vaule == ""?"未开奖":""+vaule +"开"
            },
            formPrice:function(value){
                return value / 100 + "元";
            }
        },
    }
</script>

<style scoped>
.allRecordRoot{
    width: 100%;
    display: inline-block; 
    background:#F7F7F7 
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

.allRecord {
    margin: auto;
    width: 100%;
    display: inline-block;
    margin-top: 3px;
}
.divImag{
    float: left;
    margin: 5px 0px 0px 10px;
}
.divPageCount{
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background:white;
    margin-bottom: 10px;
}
.divRowHead{
    display: block;
    width: 100%;
    padding: 5px 0px;
    font-size: 13px;
    background:white;
    margin-top: 5px;
    height: 25px;
}
.divAnimalName{
    margin-top: 5px;
    font-weight: bold;
    text-align: center;
}
.divRowContent{
    display: flex;
    flex-direction:column;
    background:#F7F7F7;
    font-size: 13px;
    height: 64px;
}
.divTermId{
    float: left;
    margin-left: 5px;
    margin-top: 5px;
    font-weight: bold;
}
.divWinnerStatue{
    float: right;;
    margin-right: 20px;
    margin-top: 5px;
    font-weight: bold;
}
.divPrice {
    margin:4px 20px 2px 50px;
}
.divBuyCnt {
   margin:1px 20px 2px 50px;
}
.divCreateTime {
    margin:1px 20px 2px 50px;
}


</style>