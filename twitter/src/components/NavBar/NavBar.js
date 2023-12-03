import React from 'react';
import bird from "../../assets/bird-image.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser, faBell, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../../redux/slices/auth.slice';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from '../Home/Home'


const Navbar = ({onHomeClick}) => {
  const navigate = useNavigate(); // Utilisez useNavigate pour gérer la navigation
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/');
  };

  const handleNotificationsClick = () => {
    toast.info('No new notifications', {
      position: toast.POSITION.TOP,
      autoClose: 3000,
    });
  };

  

  return (
    <div className="fixed h-screen w-18 bg-white p-4 ml-2 space-y-6 mt-6">
      <img src={bird} alt="Oiseau" className="h-12 w-18 mb-28" />

      <a href="#" className="flex items-center space-x-2" >
        <FontAwesomeIcon icon={faHouseUser} className="h-6 w-6 mb-6 text-blue-400" onClick={onHomeClick} />
        <span className='mb-6'>Home</span>
      </a>

      <a href="#" className="flex items-center space-x-2" onClick={()=>handleNotificationsClick()}>
        <FontAwesomeIcon icon={faBell} className="h-6 w-6 mb-6  text-blue-400" />
        <span className='mb-6'>Notifications</span>
      </a>

      <div className="flex items-center space-x-2 cursor-pointer">
        <FontAwesomeIcon icon={faRightFromBracket} className="h-6 w-6 mb-6  text-blue-400" />
        <span className='mb-6' onClick={() => handleLogout()}>Log Out</span>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      
    </div>

    
  );
};

export default Navbar;
