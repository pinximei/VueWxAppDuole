<template>
    <div class="histtoryRoot" >

        <div role="tabs" class="divTabs">
            <div role="tab" class="divLeftTab" @click="clickIndex(0)">
                <div class="divLeftContent">
                    <img :src="leftTabIcon" width="15px" height="15px">
                    <span>开奖记录</span>
                    <dir class="divLeftLine" v-show="showIndex == 0">
                    </dir>
                </div>
            </div>
            <div role="tab" class="divLeftTab" @click="clickIndex(1)" >
                <div class="divLeftContent">
                    <img :src="rightTabIcon" width="15px" height="15px">
                    <span>开奖概率</span>
                    <dir class="divLeftLine" v-show="showIndex == 1">
                    </dir>
                </div>
            </div>
        </div>


        <div class="title" v-show="showIndex == 0">
            <table>
                <tr>
                    <th>开奖期次</th>
                    <th>开奖时间</th>
                    <th>中奖生肖</th>
                </tr>
                <tr  v-for="(item, index) in lotteryHistoryInfo" :key="index">
                    <td>{{item.f_term_id}}</td>
                    <td>{{item.f_create_time | formatDate}}</td>
                    <td>{{item.f_winning_animal_name}}</td>
                </tr>

            </table>
        </div>
        <div class="divGailv" v-show="showIndex == 1">
            <div class="gailiTj">
                <div class="gailvfbtxt">
                        <h5>中奖概率统计</h5>
                </div>
                <div class="gailvfbtxt">
                        <h5>最高中奖概率生肖:{{maxName}}  概率:{{maxProb}}%</h5>
                </div>
                <div class="gailvfbtxt">
                        <h5>最低中奖概率生肖:{{minName}}  概率:{{minProb}}%</h5>
                </div>
            </div>
            <div class="gailiFb">
                <div class="gailvfbCenter">
                    <div class="gailvfbtxt">
                            <h5>中奖概率分布</h5>
                    </div>
                    
                    <div>
                    <o-chart :data="winnerProb" :height="winnerProbHeight" :width="ochartwidth" :tooltip="normalTootip"> 
                        <o-histogram position="animal_name*prob"></o-histogram>
                    </o-chart>
                    </div>
                </div>

            </div>
        </div>

        <div class="divPageCount"  v-show="page_cnt != 1 && showIndex == 0">
            <van-pagination v-model="currentPage" :page-count="page_cnt" mode="simple" @change="pageIndexInfo" />
                
        </div>
    </div>
</template>

<script>
import moment from 'moment'

    export default {
        props:['contentHeight', 'contentWidth', 'showPageIndex'],
            data() {
                return {
                    normalTootip: {
                        //提示信息
                        custom: true,
                        showXTip: true,
                        showYTip: true,
                        snap: true,
                        crosshairsType: "xy",
                        crosshairsStyle: {
                        lineDash: [2]
                        }
                    },
                    currentPage: 1,
                    showIndex: 0,
                    leftTabIcon:require("@/assets/img/kaijiang.png"),
                    rightTabIcon:require("@/assets/img/gailihui.png"),
                    ochartwidth:0,
                    curIndex:0,
                    winnerProb:[],
                    lotteryHistoryInfo:[],
                    haveNextPage:1,
                    pageNumCount:6,
                    winnerProbHeight:240,
                    page_cnt:0,
                    minName:"龙",
                    minProb:100,
                    maxName:"龙",
                    maxProb:0,
                    bFirstCreate:false
                }
            },
        methods:{
            pageIndexInfo(){
                this.getLotteryHistory(this.currentPage - 1, this.pageNumCount);        
            },
        
            clickIndex(value){
                this.showIndex = value;
                this.leftTabIcon = require("@/assets/img/kaijianghui.png");
                this.rightTabIcon = require("@/assets/img/gailihui.png");
                if(value == 0){
                    this.leftTabIcon = require("@/assets/img/kaijiang.png");
                }
                else{
                    this.rightTabIcon = require("@/assets/img/gaili.png");
                }
            },
            getRealTableCount(){
                this.ochartwidth = parseInt(this.contentWidth - 60) ;
                this.pageNumCount = parseInt((this.contentHeight - 160 ) / 33);
                this.winnerProbHeight = this.contentHeight - 340 - 10;
                console.log(this.winnerProbHeight, this.ochartwidth)
            },

            getLotteryHistory(index , num){
                this.$http.post('history/lottery_history', 
                this.$qs.stringify({start:index, page_size:num}),
                {
                    headers:{
                    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                    } 
                })
                .then((success) => {
                    this.page_cnt = success.data.page_cnt;
                    this.lotteryHistoryInfo = success.data.history;
                    this.haveNextPage = this.page_cnt > this.pageNumCount * (this.curIndex + 1);
                    this.$store.commit("setUpdateHistory", false);
                }, (error) => {
                    console.log(error);
                })
            },    
            getWinnerProb(index , num){
                this.$http.get('history/winner_prob',
                {                               
                 headers:{
                    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
                 } 
              })
                .then((success) => {
                    this.winnerProb = success.data["probs"];
                    this.winnerProb.forEach(item => {
                        item.prob /= 100;
                        if(this.minProb > item.prob){
                            this.minProb = item.prob;
                            this.minName = item.animal_name;
                        }
                        if( (this.maxProb < item.prob)){
    
                            this.maxProb = item.prob;
                            this.maxName = item.animal_name;
                        }
                    }
                    );
                }, (error) => {
                    console.log(error);
                })
            },   
        },
    filters: {
        formatDate: function (value) {
           return moment(value*1000).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    created() {
                this.getRealTableCount();
                this.getWinnerProb();
                this.getLotteryHistory(this.curIndex, this.pageNumCount);
                this.bFirstCreate = true;
    },
    watch:{
        showPageIndex(newValue, oldValue){
            if(this.$store.state.reUpdateHistory && newValue == 1 && this.bFirstCreate){
                
                this.getLotteryHistory(this.curIndex, this.pageNumCount);
                
            }
        }
    }
    }

</script>

<style scoped>
.histtoryRoot{    
    width: 100%;
    display: flex; 
    background:#F7F7F7 ;
    flex-direction: column;
}
.divTabs{
    display:flex;
    height: 52px;
    background:white
}
.divLeftTab{
    flex-grow: 1;
    text-align: center;
    height: 50px;
    vertical-align:middle;
    line-height: 50px;
    font-weight: bold;
}
.divLeftContent{
    display: block;
    height: 52px;
    margin: 0px;
    text-align: center;
}
.divLeftLine{
    width: 20%;
    height: 2px;
    background:red; 
    margin: auto;
}
.title{
    margin: 10px 0px 0px 0px;
    width: 100%;
    display: inline-block;
    background:white;
    flex-grow: 1;
}

.divPageCount{
    width: 100%;
    background:white;
    margin: 2px 0px 2px 0px;
}
table{
    width: 90%;
    margin: auto;
    border:0;
    background:white
}

th{
    height: 30px;
    font-weight: normal;
}
td{
    font-size:15px;
	text-align:center;
	border-collapse:collapse;
    height:30px; 
}
.divGailv{
    display: block;
    width: 100%;
    margin-top: 10px;
}
.gailvfbtxt{
    text-align:left;
    padding: 20px 20px 20px 40px;
}
.gailiTj{
    background:white;
    height: 200px;
}
.gailiFb{
    display: block;
    width: 100%;
    background:white;
    margin-top: 10px;
    text-align:center;

}
h5{
    margin: auto;
}
</style>