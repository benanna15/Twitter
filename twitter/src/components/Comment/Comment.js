import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Textarea, Button, IconButton, Select } from "@material-tailwind/react";
import { Dialog,DialogHeader,DialogBody,DialogFooter,} from "@material-tailwind/react";
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faComment, faRetweet, faShare, faTimes, faEllipsis, faTrash } from '@fortawesome/free-solid-svg-icons';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Like from "../Like/Like";
import LikeComment from "../LikeComment/LikeComment";
import { useDispatch, useSelector } from 'react-redux';
import { setComments, addComment, updateComment, deleteTheComment, updateTotalLikesPerTweet } from "../../redux/slices/comments.slice"
import { getPseudo, getImage } from '../../redux/slices/auth.slice';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { setLikesComment } from "../../redux/slices/likesComment.slice";
import { updateTotalCommentPerTweet } from '../../redux/slices/tweets.slice';

import ImageModal from '../ImageModal/ImageModal';


function App() {
  return <Picker />;
}

const Comment = (props) => {
  const { id , tweetedId } = props;
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.comments);
  const likesComments = useSelector((state) => state.likesComment.likes);
  const pseudo = useSelector(getPseudo);
  const image = useSelector(getImage);
  

  const [showLargeImage, setShowLargeImage] = useState(false);
  const [largeImageSrc, setLargeImageSrc] = useState('');


  const tweets = useSelector((state) => state.tweets.tweets);
  const tweet = tweets.find((t) => t.id === tweetedId);
  const likes = useSelector((state) => state.likes.likes);

  const [dataComment, setDataComment] = useState();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(tweet.comment);
  const [editCommentID, setEditCommentID] = useState(0);
  const [myComment, setMyComment] = useState(false);
  const [commentContentEdit, setCommentContentEdit] = useState("");
  const [error, setError] = useState();
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleteComment, setDeleteComment] = useState(false);


 
  const fetchData = async (dispatch, id, tweetedId) => {
    try {
      const [commentsResponse, likesResponse] = await Promise.all([
        axios.get('https://promises-cb263f.appdrag.site/api/getAllComment', {
          params: {
            AD_PageNbr: '1',
            AD_PageSize: '500',
            timestamp: moment().unix(),
          },
        }),
        axios.get('https://promises-cb263f.appdrag.site/api/getLikesComment', {
          params: {
            "AD_PageNbr": "1",
            "AD_PageSize": "500"
          },
          
        }),
      ]);
  
      const commentsData = commentsResponse.data.Table
      const likesData = likesResponse.data.Table;
   
      commentsData.sort((a, b) => new Date(a.date) - new Date(b.date));
      const filteredComments = commentsData.filter(comment => comment.TweetID == tweetedId);
      dispatch(setComments(filteredComments));
     
      dispatch(setLikesComment(likesData));


    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
    }
  };
  

  const handleEmojiClick = (emoji) => {
    const updatedCommentText = commentText + emoji.native;
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
    setCommentText(updatedCommentText);

  };
  const handleModify = (comment) => {
    setMyComment(true)
    setEditCommentID(comment.id)
    setCommentContentEdit(comment.CommentContent)
   }
  const handleSubmit= () => 
    {
    if (commentText.trim() === "") {
      toast.error("Tweet content cannot be empty.");
      setError(true);
      return;
    } else {
      axios.get('https://promises-cb263f.appdrag.site/api/AddTweetComment', {
  params: {
    UserID : id,
    date :moment().format(),
    CommentContent  : commentText,
    TweetID : tweetedId,
    name : pseudo ,
    image : image
  }
        })
        .then(function (response) {
        
      
          dispatch(addComment({
            "UserID": id,
            "date" :moment().format(),
            "CommentContent"  : commentText,
            "TweetID" : tweetedId,
            "name" : pseudo ,
            "image" : image
          }))
        
            setCommentText("");
            fetchData(dispatch, id, tweetedId);
            updateTotalComment(tweetedId, (commentCount +1) )
       
        })
        .catch(function (error) {
          console.error("Error submitting tweet:", error);
         
        });
    }


} 
const handleModifyComment = (commentid) => {
  if (commentContentEdit.trim() === '') {
    toast.error('Tweet content cannot be empty.');
    setError(true);
    return;
  } else {
    axios.get('https://promises-cb263f.appdrag.site/api/updateComment', {
  params: {
          "id": commentid,
          "date": moment().format(),
          "CommentContent" : commentContentEdit
          
        },
      })
      .then(function (response) {
       
        if (response.data.affectedRows > 0) {
   
          const updatedComment = {
            "id": commentid,
            "date": moment().format(),
            "CommentContent" : commentContentEdit
            // Add other properties if necessary
          };
          
          dispatch(updateComment(updatedComment));
          setCommentContentEdit("")
          setMyComment(false);
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

const handleDelete = (comment) => {
  setCommentToDelete(comment); 
  setDeleteComment(true);
  
 
 
};
const confirmDelete = () => {
  if (commentToDelete) {
    
    axios
      .get('https://promises-cb263f.appdrag.site/api/deleteComment', {
        params: {
          id: commentToDelete.id,
        },
      })
      .then(function (response) {
        if (response.data.affectedRows > 0) {
       
          dispatch(deleteTheComment(commentToDelete.id));
       
          updateTotalComment(tweetedId, ( commentCount - 1))
        } else {
          console.log('Erreur lors de la suppression du comment');
        }
      });
    setDeleteComment(false); 
  }
};

const cancelDelete = () => {
  setDeleteComment(false); 
};  


  
 useEffect(() => {
    fetchData(dispatch, id, tweet.id);
  }, [dispatch]);

  const updateTotalComment = (tweetId, commentChange) => {
    axios
      .get('https://promises-cb263f.appdrag.site/api/updateTweetComment', {
        params: {
          "id": tweetId,
          "comment": commentChange,
        },
      })
      .then((response) => {
        if (response.data.affectedRows > 0) {          
          dispatch(
            updateTotalCommentPerTweet({
              "tweetId": tweetId,
              "commentChange": commentChange
            })
          );
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du nombre total de likes :', error);
      });
  };

  return (
    <div className="w-full overflow-scroll " >
      <ToastContainer position="top-right" className="" autoClose={3000} />
     <DialogHeader className="pl-10 pt-12   w-full ">
      {tweet && (
        <div className="flex w-full ">

          <div className="rounded-full  h-12 w-12 bg-gray-300 flex items-center justify-center cursor-pointer"
          onClick={() => {
            setLargeImageSrc(tweet.image);
            setShowLargeImage(true);
          }}>
            <img src={tweet.image}  alt="Profile" className="h-10 w-10 rounded-full" />
          </div>

          <div className="w-full pr-8">
            <p className="font-semibold text-base ml-4">{tweet.Name}</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 ml-4 text-xs">
                {moment(tweet.date).format("LLL")}
              </p>
            </div>
            <div className="mt-4 border rounded bg-blue-50 p-2 w-full w-96  text-base">
              <p className="my-3 ">{tweet.TweetContent}</p>
            </div>
            <div className="flex justify-end text-lg">
              <Like id={id} tweet={tweet} likes={likes} /> 

            </div>
          </div>
        </div>
      )}
    </DialogHeader>

    <DialogBody className="comment-container max-h-[400px] overflow-y-auto "  >
        <div >
        {comments && comments.length > 0 ? (
  comments.map((comment, index) => (
    <div key={comment.id || index} className="mb-4 mx-8  text-xs " >
    
      <div className="flex ">
        <div className="rounded-full h-11 w-12 bg-gray-300 flex items-center justify-center cursor-pointer"
        onClick={() => {
          setLargeImageSrc(comment.image);
          setShowLargeImage(true);
        }}>
          <img src={comment.image} alt={comment.name} className="h-10 w-10 rounded-full" />
        </div>

        <div className="ml-4 w-full ">
  <p className="font-semibold">{comment.name}</p>
  <div className="flex items-center justify-between">
    <p className="text-gray-500">{moment(comment.date).format("LLL")}</p>
    <LikeComment id={id} comment={comment} likes={likesComments} tweetedId ={tweetedId} commentedId={comment.id} />
  </div>

          
          <div className="mt-2 border rounded bg-gray-200 p-1" >


          {myComment && editCommentID == comment.id ? 
          <div className=" px-2 border rounded bg-slate-100 relative">
          <button
            className="absolute top-1 right-3 text-gray-500 p-2 cursor-pointer"
            onClick={() => setMyComment(false)}
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
          
          <textarea
            className="my-3 w-full p-4  overflow-auto"
            value={commentContentEdit || ''}
            rows={2}
            onChange={(e) => setCommentContentEdit(e.target.value)}
          />
          <div className="h-2" />
          <button
            type="submit"
            onClick={()=>handleModifyComment(comment.id)}
            className="absolute bottom-0 right-2 bg-transparent text-blue-500 px-3 mt-1 rounded"
          >
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div> :
            <p className="my-3 ">{comment.CommentContent}</p>
      }
          </div>
        </div>
        
      </div>
      {comment.UserID === id && (

      
              
              <div className="flex flex-row justify-between mt-1 ml-14">

              <button className="p-2 flex items-center font-medium" onClick={() => handleModify(comment)}>
                 <FontAwesomeIcon icon={faRetweet}  variant="small" className="font-medium  text-black-500 mr-2"/>Modify
              </button>

              <button className="p-2 flex items-center font-medium " onClick={() => handleDelete(comment)}>
                 <FontAwesomeIcon icon={faTrash} className="text-black-500 mr-2 font-medium text-blue-500" />Delete 
              </button>

              </div>
            
            )}
    </div>
    
  ))
) : (
  <div className="flex justify-center">No comments</div>
)}
 <ConfirmationModal
                isOpen={deleteComment}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
                className="max-w-screen-md"
               
              />
</div>
  
  </DialogBody>
<DialogFooter className="ml-4 mr-6">
        <div className="flex ml-2 w-full  flex-row items-center gap-2 rounded-[99px] border border-gray-900/10 bg-gray-900/5 p-2">
          <div className="flex">
            <IconButton variant="text" className="rounded-full" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </IconButton>
          </div>

          <Textarea 
            value={commentText} 
            onChange={(e) => setCommentText(e.target.value)}
            rows={1}
            resize={true}
            placeholder="Your Message"
            className="min-h-full !border-0 focus:border-transparent"
            containerProps={{ className: "grid h-full" }}
            labelProps={{ className: "before:content-none after:content-none" }}
          />

          <div>
            <IconButton variant="text" className="rounded-full" onClick={handleSubmit}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </IconButton>
          </div>
        </div>
      </DialogFooter>
      {showLargeImage && (
  <ImageModal
    src={largeImageSrc}
    onClose={() => setShowLargeImage(false)}
  />
)}
      {showEmojiPicker && <Picker data={data} onEmojiSelect={handleEmojiClick} />}
  </div>
);
};

export default Comment;
