import React from "react"
import "./style.css"
const UsernameCard = (props) =>{
return(
<>

<div className="username_card">
<div className="username_card_image">
    {
        props.user.picture == ""?(
        <h3 className="profile_caractere">{props.user.username[0]}</h3>):(
    
    <img src={props.user.picture}/>
)}
</div>
<div className="username_card_info">
    <h3 className="username"> {props.user.username}
        {""}
    </h3>
    <span className="small">{props.user.email}
    {""}
    </span>

</div>
</div>




</>




)

}
export default UsernameCard