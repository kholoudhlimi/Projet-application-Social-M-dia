import axios from'axios'
const userService = {}

userService.register = function(data){
return axios.post('http://localhost:3000/api/auth/signup' , data)

}
userService.login = function(data){
    return axios.post('http://localhost:3000/api/auth/login' , data)
    
    }
    
export default userService