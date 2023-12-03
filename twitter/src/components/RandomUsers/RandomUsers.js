import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageModal from '../ImageModal/ImageModal';


const RandomUsers = () => {
  const [users, setUsers] = useState([]);
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [largeImageSrc, setLargeImageSrc] = useState('');
  useEffect(() => {
 
    axios.get('https://promises-cb263f.appdrag.site/api/getAllUsers', {
      params: {
        "AD_PageNbr": "1",
        "AD_PageSize": "500"
      }
    }).then(function (response) {
        const shuffledUsers = response.data.Table.sort(() => Math.random() - 0.5);
        const selectedUsers = shuffledUsers.slice(0, 5);
        setUsers(selectedUsers);
    }).catch(function (error) {
      console.error('Une erreur s\'est produite lors de la récupération des utilisateurs :', error);
    });
  }, []);

  return (
    <div className="random-users-section">
      
      <div className="user-list">

        


        {users && users.map((user,index) => (

            <div key={user.id ||  index} className="p-4 mb-4 ">
              <div className="flex items-center ">
                <div className="rounded-full   h-12 w-12 bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setLargeImageSrc(user.image);
                  setShowLargeImage(true);
                }}>
                  <img src={user.image} alt={user.pseudo} className="h-10 w-10 rounded-full" />
                </div>

                <p className="font-semibold ml-3">{user.pseudo}</p>


          </div>
          </div>
        ))}
      </div>
      {showLargeImage && (
  <ImageModal
 
    src={largeImageSrc}
    onClose={() => setShowLargeImage(false)}
  />
)}
    </div>
  );
};

export default RandomUsers;
