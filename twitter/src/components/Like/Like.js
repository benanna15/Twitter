import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateTotalLikesPerTweet } from '../../redux/slices/tweets.slice';
import { setLikes, addLike, updateLike } from '../../redux/slices/likes.slice';

const Like = (props) => {
  const { tweet, id ,likes } = props;
  const dispatch = useDispatch();
  //const likes = useSelector((state) => state.likes.likes);
  const [redHeart, setRedHeart] = useState(tweet.redHeart || false);
  const [findLike, setFindLike] = useState(false);
  const [likeCount, setLikeCount] = useState(tweet.like);

  useEffect(() => {
    if (likes) {
      const findTweetValue = likes.find(
        (tweets) => tweets.user_id === id && tweets.tweet_id === tweet.id
      );

      setFindLike(!!findTweetValue); // Convertir en booléen
      setRedHeart(findTweetValue?.liked == 1)
    
    }
  }, [tweet.id,id]);

  const handleLikeClick = async () => {
    const newLikeValue = redHeart ? 0 : 1;
    const updatedLikeCount = likeCount + (newLikeValue === 1 ? 1 : -1);
  
    try {
      if (findLike) {
        await axios.get('https://promises-cb263f.appdrag.site/api/updateLike', {
          params: {
            tweet_id: tweet.id,
            user_id: id,
            liked: newLikeValue,
            redHeart: newLikeValue,
          },
        });
  
        dispatch(
          updateLike({
            tweet_id: tweet.id,
            user_id: id,
            liked: newLikeValue,
            redHeart: newLikeValue,
          })
        );
  
        updateTotalLikes(tweet.id, updatedLikeCount, newLikeValue);
        setLikeCount(updatedLikeCount);
        setRedHeart(newLikeValue);
      } else {
        await axios.get('https://promises-cb263f.appdrag.site/api/addEachLike', {
          params: {
            user_id: id,
            tweet_id: tweet.id,
            liked: 1,
            redHeart: 1,
          },
        });
  
        updateTotalLikes(tweet.id, updatedLikeCount, newLikeValue);
        dispatch(
          addLike({
            user_id: id,
            tweet_id: tweet.id,
            liked: 1,
            redHeart: 1,
          })
        );
        setFindLike(true);
        setRedHeart(newLikeValue);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du like :', error);
    }
  };
  const updateTotalLikes = (tweetId, likeChange, newLikeValue) => {
    axios
      .get('https://promises-cb263f.appdrag.site/api/updateTweetLike', {
        params: {
          "id": tweetId,
          "like": likeChange,
        },
      })
      .then((response) => {
        if (response.data.affectedRows > 0) {
          setLikeCount(likeChange);
          dispatch(
            updateTotalLikesPerTweet({
              "tweetId": tweetId,
              "likeChange": likeChange,
              "redHeart": newLikeValue,
            })
          );
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du nombre total de likes :', error);
      });
  };

  return (
    <div>
      <button
        className={`p-2 flex items-center text-black-500`}
        type="button"
        onClick={handleLikeClick}
      >
        <FontAwesomeIcon
          icon={faHeart}
          className={`mr-2 ${redHeart ? 'text-red-500' : 'text-black-500'}`}
        />
        {likeCount > 0 && <span>{likeCount}</span>}
      </button>
    </div>
  );
};

export default Like;
