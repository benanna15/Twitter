import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faComment, faRetweet, faShare, faTimes, faEllipsis, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { json } from 'react-router-dom';
import Like from '../Like/Like';
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import CommentDialog from '../Comment/CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setTweets , addTweet, updateTweet, deleteTheTweet } from '../../redux/slices/tweets.slice';
import { setLikes  } from '../../redux/slices/likes.slice';
import ImageModal from '../ImageModal/ImageModal';
import { Textarea } from "@material-tailwind/react";
import { updateTotalLikesPerTweet } from '../../redux/slices/tweets.slice';

const Home = ({ user, filteredTweets  }) => {
  const { id, pseudo, image } = user;
  const dispatch = useDispatch();
  const tweets = useSelector((state) => state.tweets.tweets);
  
  const likes = useSelector((state) => state.likes.likes);

   
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [largeImageSrc, setLargeImageSrc] = useState('');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);


  const [tweetCount, setTweetCount] = useState(0);
  const [myTweet, setMyTweet] = useState(false);
  const [editTweetId, setEditTweetId] = useState();
  const [tweetContentAdd, setTweetContentAdd] = useState("");
  const [tweetContentEdit, setTweetContentEdit] = useState("");
  const [error, setError] = useState(false);
  const [deleteTweet, setDeleteTweet] = useState(false);
  const [tweetToDelete, setTweetToDelete] = useState(null);
  const [commentClick, setCommentClick] = useState(false);
  const [commentedTweetId, setCommentedTweetId] = useState(null);
  
const deleteCommentClick = () => {
  setCommentClick(false)
}
  //ecrire tweets
  const handleSubmit = async () => {
    if (tweetContentAdd.trim() === '') {
      toast.error('Tweet content cannot be empty.');
      setError(true);
      return;
    }
  
    try {
      const response = await axios.get('https://promises-cb263f.appdrag.site/api/AddTweet', {
        params: {
          "TweetContent": tweetContentAdd,
          "UserID": id,
          "Name": pseudo,
          "date": moment().format(),
          "image": image
        }
      });
  
      // Votre logique ici, par exemple, vérifier si l'ajout a réussi
      if (response.data.affectedRows > 0) {
        // Si l'ajout a réussi, utilisez le dispatch pour envoyer une action addTweet avec les données du nouveau tweet
        dispatch(addTweet({
          "TweetContent": tweetContentAdd,
          "UserID": id,
          "Name": pseudo,
          "date": moment().format(),
          "image": image
        }));
        
        setTweetContentAdd("");
        setError(false);
      } else {
        console.log("Error adding the tweet");
      }
    } catch (error) {
      console.error('An error occurred while submitting the tweet:', error);
    }
  };
  
//bouton modifier
 const handleModify = (tweet) => {
  setMyTweet(true)
  setEditTweetId(tweet.id)
  setTweetContentEdit(tweet.TweetContent)
 }
  //modify tweet
  const handleModifyTweet = (tweetid) => {
    if (tweetContentEdit.trim() === '') {
      toast.error('Tweet content cannot be empty.');
      setError(true);
      return;
    } else {
      axios
        .get('https://promises-cb263f.appdrag.site/api/updateTweet', {
          params: {
            "id": tweetid,
            "TweetContent": tweetContentEdit,
            "date": moment().format()
            
          },
        })
        .then(function (response) {
         
          if (response.data.affectedRows > 0) {
            const updatedTweetId = response.data.id;
            // Update the tweet in the Redux store
            
            const updatedTweet = {
              "id": tweetid,
              "TweetContent": tweetContentEdit,
              "date": moment().format()
              // Add other properties if necessary
            };
            dispatch(updateTweet(updatedTweet));
            setMyTweet(false);
          } else {
            console.log('Error updating the tweet');
          }
        })
        .catch(function (error) {
          console.error('Error in AJAX request:', error);
        })
        .finally(() => {
          
          setError(false);
        });
    }
  };
  // delete
  const handleDelete = (tweet) => {
    setTweetToDelete(tweet); // Mémorisez le tweet à supprimer.
    setDeleteTweet(true); // Affichez la boîte de dialogue de confirmation.
   
  };
  const confirmDelete = () => {
    if (tweetToDelete) {
      axios
        .get('https://promises-cb263f.appdrag.site/api/deleteTweet', {
          params: {
            id: tweetToDelete.id,
          },
        })
        .then(function (response) {
          if (response.data.affectedRows > 0) {
            // Supprimez le tweet dans le store Redux
            dispatch(deleteTheTweet(tweetToDelete.id));
            // Effectuez des actions supplémentaires en cas de suppression réussie.
          } else {
            console.log('Erreur lors de la suppression du tweet');
          }
        });
      setDeleteTweet(false); // Fermez la boîte de dialogue après la suppression.
    }
  };
  
  const cancelDelete = () => {
    setDeleteTweet(false); // Annulez la suppression et fermez la boîte de dialogue.
  };  
  //bouton comment
  const handleCommentClick = (tweetId) => {
    setCommentClick(!commentClick)
    setCommentedTweetId(tweetId);
    }
  //lire les tweets

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tweetsResponse, likesResponse] = await Promise.all([
          axios.get('https://promises-cb263f.appdrag.site/api/getAllTweets', {
            params: {
              AD_PageNbr: '1',
              AD_PageSize: '500',
              timestamp: moment().unix(),
            },
          }),
          axios.get('https://promises-cb263f.appdrag.site/api/getLikes', {
            params: {
              "AD_PageNbr": "1",
              "AD_PageSize": "500"
            },
          }),
        ]);
  
        const tweetsData = tweetsResponse.data.Table;
        const likesData = likesResponse.data.Table;
  
        tweetsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        const findTweetValue = likesData.find(
          (tweets) => tweets.user_id === id && tweets.tweet_id === tweetsData.id
         );
   
        dispatch(setTweets(tweetsData));
        dispatch(setLikes(likesData));
      } catch (error) {
        console.error('Une erreur s\'est produite :', error);
      }
    };
   
    fetchData();
  

  }, [dispatch,commentClick]);
 


  
 
  
  return (
    <div className="flex">
      <div className="flex-grow p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Welcome, {pseudo} !</h1>
        </div>

        <div className="mb-4 flex flex-col">
          <textarea
            placeholder="What's happening?"
            className={`w-full border  rounded p-2 mb-2 ${error ? 'border-red-500' : ''}focus:outline-none focus:border-cyan-500 focus:ring-cyan-500`}
            rows="5"
            value={tweetContentAdd || ""}
            onChange={(e) => setTweetContentAdd(e.target.value)}
          />
          
          <button type="submit" onClick={() => handleSubmit()} className="bg-blue-500 text-white px-4 py-2 rounded self-end">
            Tweet
          </button>
          <ToastContainer position="top-right" className="" autoClose={3000} />
        </div>

        {filteredTweets &&
          filteredTweets.map((tweet, index) => (

            <div key={tweet.id ||  index} className="p-4 mb-4 ">
              <div className="flex items-center ">
                <div className="rounded-full   h-12 w-12 bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setLargeImageSrc(tweet.image);
                  setShowLargeImage(true);
                }}>
                  <img src={tweet.image} alt={tweet.Name} className="h-10 w-10 rounded-full" />
                </div>

                <div className="ml-4 w-full ">
               
                  <p className="font-semibold">{tweet.Name}</p>
                  <div className="flex items-center justify-between  ">
                  <p className="text-gray-500">{moment(tweet.date).format('LLL')}</p>

               
                {/*   Menu contextuel */}
                {tweet.UserID === id && (
               
                  <Menu  >
                  <MenuHandler >
                    <FontAwesomeIcon icon={faEllipsis}
                      variant="circular"
                      alt="tania andrew"
                      className="cursor-pointer text-xl text-gray-600"/>
                  </MenuHandler>
                  <MenuList >
                    <MenuItem className="flex items-center gap-3" onClick={() => handleModify(tweet)}>
                      <FontAwesomeIcon icon={faRetweet}  variant="small" className="font-medium text-black-500 mr-2"/>Modify
                    </MenuItem>
                    <MenuItem className="flex items-center gap-4" onClick={() => handleDelete(tweet)}>
                      <FontAwesomeIcon icon={faTrash} className="text-black-500 mr-2 font-medium text-red-500" />Delete 
                    </MenuItem>
                  </MenuList>
                </Menu>
              
               )}
               
                  </div>
                </div>
                
                
              
             
              </div>

              {myTweet && editTweetId === tweet.id ?  (

            
                <div className="mt-4 ml-16 px-4 border rounded bg-slate-100 relative">
                  <button
                    className="absolute top-1 right-3 text-gray-500 p-2 cursor-pointer"
                    onClick={() => setMyTweet(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                  </button>
                  
                  <textarea
                    className="my-3 w-full p-4 resize-y overflow-auto"
                    value={tweetContentEdit || ''}
                    rows={2}
                    onChange={(e) => setTweetContentEdit(e.target.value)}
                  />
                  <div className="h-6" />
                  <button
                    type="submit"
                    onClick={()=>handleModifyTweet(tweet.id)}
                    className="absolute bottom-0 right-2 bg-transparent text-blue-500 px-3 py-3 rounded"
                  >
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                </div>
              ) : (
                <div className="mt-4 ml-16 px-4 border rounded bg-blue-50">
                  <p className="my-3">{tweet.TweetContent}</p>
                </div>
              )}

               <div className="flex flex-row justify-between mt-4 ml-16">
              
               
                   <Like id={id} tweet={tweet} likes={likes} isCommentDialogClose={isCommentDialogOpen}/> 
<div  onClick={() => handleCommentClick(tweet.id)} >
                
                  <button className="p-2 flex items-center" >
        <FontAwesomeIcon icon={faComment} className="text-blue-500 mr-2" />{tweet.comment && tweet.comment > 0 && <span>{tweet.comment}</span>}
    </button>
    </div>   
    
              </div> 
              
            </div>
          ))}
          <ConfirmationModal
                isOpen={deleteTweet}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
                className="max-w-screen-md"
               
              />
              {commentClick && (
  <CommentDialog
    id={id}
    isOpen={commentClick}
   
    tweetedId={commentedTweetId}
    onClose={() => {
      setCommentClick(false);
      deleteCommentClick();
      setIsCommentDialogOpen(true)
    }}
  />
)}
{showLargeImage && (
  <ImageModal
 
    src={largeImageSrc}
    onClose={() => setShowLargeImage(false)}
  />
)}
      </div>
    </div>
  );
};

export default Home;