import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import userService from './../../../services/userService';  

const Navbar = () => {
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user_data')));
  const userPicture = userData ? userData.picture : '';

  const handleLogout = async () => {
    try {
      const message = await userService.logout(); 
      console.log(message); 
      localStorage.removeItem('user_data');
      localStorage.removeItem('token'); 
      localStorage.removeItem('userId'); 
      setUserData(null);
      window.location.href = '/login'; 
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar_left">
        <b>Social Working CLUB</b>
      </div>
      <div className="navbar_right">
        <div className="navbar_profile_search">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="small gray" />
          <input type="text" placeholder="rechercher ..." />
        </div>
        <button className="navbar_profile_button" onClick={handleLogout}>
          Déconnexion
        </button>
        <div className="navbar_profile_image">
          {userPicture ? (
            <img src={userPicture} alt="Profile" />
          ) : (
            <img src="/path/to/default-profile.png" alt="Default Profile" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
