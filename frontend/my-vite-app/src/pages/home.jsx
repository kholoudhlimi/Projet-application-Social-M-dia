import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import UsernameCard from "./components/usernameCard.jsx";
import Sidebar from "./components/sidebar/index.jsx";
import Stories from "./components/stories/index.jsx";
import Request from "./components/requests/index.jsx";
import Posts from "./components/posts/index.jsx";

const Home = () => {
    const [connectedUser, setConnectUser] = useState({});
const navigate = useNavigate()
    const getConnectedUserData = () => {
        setConnectUser(JSON.parse(localStorage.getItem("user_data")));
        if(localStorage.getItem("user_data")== null){ //user not connected
            // rederection vers page login 
navigate("login");

        }
    };

    useEffect(() => {
        getConnectedUserData(); // Appeler la fonction
    }, []);

    return (
        <>
        

<Navbar/>
<div className="layout-app">
    {/* left */}
    <div style={{width:"25%"}}>
    <UsernameCard user={connectedUser} />
    <Sidebar />
    </div>
    <div style={{width:"50%"}}>
      < Stories />
      <Posts/>
    </div>
    <div style={{width:"25%"}}>
  < Request />
    </div>

</div>


            {/* <h1>hello {connectedUser.pseudo}</h1> */}
        </>
    );
};

export default Home;
