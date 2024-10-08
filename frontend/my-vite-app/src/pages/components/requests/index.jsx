import React from "react"
import './style.css'
import Requeste from "./request"



const Request = () => {

const request =[
{
    name :" kholoudi hlimi",
    profile_image:"https://images.pexels.com/photos/3782333/pexels-photo-3782333.jpeg?auto=compress&cs=tinysrgb&w=600"

},{
    name :" kholouda hlimi",
    profile_image:"https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400"

},{
    name :" kholoud hlimi",
    profile_image:"https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"

},{
    name :" kholoudo hlimi",
    profile_image:"https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400"

},{
    name :" kholoudo hlimi",
    profile_image:"https://images.pexels.com/photos/871495/pexels-photo-871495.jpeg?auto=compress&cs=tinysrgb&w=400"

}

]

    return (

        <>


            <div className="request">



                <div className="request_title">
                    <h4> Request </h4>
                    <h4  className="request_number">5</h4>
                </div>
{
    request.map(req=> 
        <Requeste data={req}/>)

}
              
                

            </div>



        </>



    )





}
export default Request