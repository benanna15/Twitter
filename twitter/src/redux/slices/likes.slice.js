// likes.slice.js

import { createSlice } from '@reduxjs/toolkit';

const likesSlice = createSlice({
  name: 'likes',
  initialState: {
    likes: [],
  },
  reducers: {
    setLikes: (state, action) => {
        state.likes = action.payload.map(like => ({
          id: like.id,
          user_id: like.user_id,
          tweet_id: like.tweet_id,
          liked: like.liked,
          redHeart: like.redHeart
        }))
      
     
    },
    addLike: (state, action) => {
      state.likes.push(action.payload);
    },
    updateLike: (state, action) => {

      const { tweet_id, user_id, liked, redHeart } = action.payload;
    
      // Utilisez une copie du tableau pour éviter de modifier le state directement
      const updatedLikes = state.likes.map((like) =>
        like.tweet_id === tweet_id && like.user_id === user_id ? { ...like, liked: liked, redHeart:redHeart} : like
      );
    
     
    
      // Retournez une nouvelle copie de l'état
      return {
        ...state,
        likes: updatedLikes,
      


      };
    },
  },
});

export const { setLikes, addLike, updateLike } = likesSlice.actions;
export default likesSlice.reducer;
