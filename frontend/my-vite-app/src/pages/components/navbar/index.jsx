import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import userService from './../../../services/userService';  // Adjust the path as necessary

const Navbar = () => {
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user_data')));
  const userPicture = userData ? userData.picture : '';

  const handleLogout = async () => {
    try {
      const message = await userService.logout(); // Call the logout function from userService
      console.log(message); // Optional: display the success message
      localStorage.removeItem('user_data');
      localStorage.removeItem('token'); // Clear the token as well
      localStorage.removeItem('userId'); // Clear the userId if applicable
      setUserData(null);
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar_left">
        <b>space chat</b>
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
