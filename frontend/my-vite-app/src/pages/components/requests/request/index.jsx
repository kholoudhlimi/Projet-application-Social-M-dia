import React from "react"
import'./style.css'

const Requeste = (props)=> {
    const {data}=props
return (
<>

<div className="requeste" >
    <div className="requeste_details">
        <img className="user_image" src={data.profile_image}/>
       <p> <b>{data.name}</b> want to add you </p>


    </div>
    <div className="requeste_insewers">
        <button className="accepter_btn">Accepter</button>
        <button className="refuser_btn">Refuser</button>




    </div>
</div>






</>








)




}
export default Requeste