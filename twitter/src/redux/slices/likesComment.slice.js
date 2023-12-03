import { createSlice } from '@reduxjs/toolkit';

const likesCommentSlice = createSlice({
  name: 'likesComment',
  initialState: {
    likes: [],
  },
  reducers: {
    setLikesComment: (state, action) => {
        state.likes = action.payload.map(like => ({
          id: like.id,
          user_id: like.user_id,
          comment_id: like.comment_id,
          liked: like.liked,
          redHeart: like.redHeart,
          tweetedId:like.tweetedId
        }))
      
    
    },
    addLikeComment: (state, action) => {
      state.likes.push(action.payload);
    },
    updateLikeComment: (state, action) => {
      const { tweet_id, user_id, liked, redHeart } = action.payload;
    
   
      const existingLike = state.likes.find(
        (like) => like.tweet_id === tweet_id && like.user_id === user_id
      );
    
      if (existingLike) {
        existingLike.liked = liked;
        existingLike.redHeart = redHeart;
      } else {

        state.likes.push({
          tweet_id,
          user_id,
          liked,
          redHeart,
        });
      }
    
     
    },
      
      
  
   },
});

export const { setLikesComment, addLikeComment, updateLikeComment } = likesCommentSlice.actions;
export default likesCommentSlice.reducer;
