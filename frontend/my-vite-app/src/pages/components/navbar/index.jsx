import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  // Récupération des données de l'utilisateur
  const userData = JSON.parse(localStorage.getItem('user_data')); // Récupération de l'objet utilisateur
  const userPicture = userData ? userData.picture : ''; // Accès à l'image de profil

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
        <button className="navbar_profile_button">
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
