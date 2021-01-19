import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
      code:"11",
      openId:"oTOQT6qcO5HHd-5RkJO0g-DD5fjI",
      message:"",
      nickName:"",
      userImg:"",
      reUpdateHistory:false
  },
  mutations: {
    setUpdateHistory(state, value){
      state.reUpdateHistory = value;
    },
    setUserImg(state, value){
      if(value == ""){
        return;
      }
      
      state.userImg = value;
    },
    setNickName(state, value){
      if(value == ""){
        return;
      }
      state.nickName = value;
    },
    setOpenId(state, value){
      if(value == ""){
        return;
      }

      state.openId = value;
      localStorage.setItem("openId", value);
    },
    setCode(state, value){
      state.code = value
    },
    reportLog(state, msg){
      let data ={
        code: state.code, 
        openid:state.openId,
        retData:msg
      };
      Vue.prototype.$http.post('report/report_log',Vue.prototype.$qs.stringify(data),
            {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              }
              }
              ).then((success) => {

            }, (error) => {
            console.log(error);
          })
    }
  }
})