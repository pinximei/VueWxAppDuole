import axios from 'axios'
const instance = axios.create({
    baseURL:'http://duole.site'
})
export default instance