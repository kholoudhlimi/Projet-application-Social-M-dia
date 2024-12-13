import React from "react";
import './style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faGear, faHome, faPhotoFilm, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";


const Sidebar = () => {


    return (

        <>
            <div className="sidebar">
                <div className="sidebar_menu">
                    <a className="active">
                        {""}
                        <FontAwesomeIcon icon={faHome} className="me-3" /> <b>Acceuil</b></a>
                    <a>
                        {""}

                        <FontAwesomeIcon icon={faUsers} className="me-3" /><b>Amis</b></a>
                    <a>
                        {""}
                        <FontAwesomeIcon icon={faPhotoFilm} className="me-3" /><b>Photos</b></a>
                    <a>

                        {""}
                        <FontAwesomeIcon icon={faCalendarDay} className="me-3" /> <b>Fil d'actualités</b></a>
                    <a>
                        {""}
                        <FontAwesomeIcon icon={faUser} className="me-3" /> <b>Profile</b></a>
                    <a>
                        {""}
                        <FontAwesomeIcon icon={faGear} className="me-3" /> <b>Parametres</b></a>
                </div>

            </div>



        </>





    )




}
export default Sidebar;