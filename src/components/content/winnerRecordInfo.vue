<template>
    <div class="allRecordRoot">
        <div class="head">
            <div class="leftArror"  >
                <img src="@/assets/img/leftArror.png" @click="clickItem" width="15px" height="15px"> 
            </div>
             <div class="title"><span>我的中奖记录</span></div>
        </div>
        <div class="allRecord">

                <div class="divRow"  v-for="(item, index) in winnerRecoderData" :key="index">
                    <div class="divRowHead">
                        <div class="divImag">
                            <img src="@/assets/img/winner.png" @click="clickItem" width="15px" height="15px"> 
                        </div>
                        <div class="divTermId">
                            <span >第{{item.f_term_id}}期</span>        
                        </div>
                        <div class="divWinnerStatue">
                            <span>恭喜中奖</span>
                        </div>
                        <div class="divAnimalName">
                            <span>{{item.f_buy_animal_name}}</span>
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
            winnerRecoderData:[],
            winnerRecordIndex:0,
            winnerRecoderHaveNextPage:0,
            pageNumCount:6,
            page_cnt:0
        }
    },
    methods:{
        clickItem(){
            this.$emit("curPage", 2); 
        },
        pageIndexInfo(){
            this.getWinnerRecord(this.currentPage - 1, this.pageNumCount);        
        },
        
        getWinnerRecord(index , num){
            this.$http.post('user_center/winning_records', 
            this.$qs.stringify({start:index, page_size:num,openid: this.$store.state.openId}),
            {
                headers:{
                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                } 
            })
            .then((success) => {
                this.page_cnt = success.data.page_cnt;
                this.winnerRecoderData = success.data.records;
                this.winnerRecoderHaveNextPage = (this.winnerRecordIndex + 1) < this.page_cnt;
            }, (error) => {
                console.log(error);
            })
        },
        getRealTableCount(){
            this.pageNumCount = parseInt((this.contentHeight - 60) / 98);
        },
    },
    created() {
        this.getRealTableCount();
        this.getWinnerRecord(this.winnerRecordIndex, this.pageNumCount);
    },
    filters: {
        formatDate: function (value) {
        return moment(value*1000).format('YYYY-MM-DD HH:mm:ss')
        },
        formStatue:function(vaule){
             return vaule == "1"?"未开奖":"已开奖"
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
    background:#eee 
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
    background:#f0f0f0;
    font-size: 12px;
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
    color: red;
}
.divPrice {
    margin:5px 20px 2px 50px;
}
.divBuyCnt {
   margin:2px 20px 2px 50px;
}
.divCreateTime {
    margin:2px 20px 2px 50px;
}



</style>