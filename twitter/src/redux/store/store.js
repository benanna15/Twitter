import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/auth.slice";
import tweetsSlice from "../slices/tweets.slice";
import commentsSlice from "../slices/comments.slice";
import likesSlice from "../slices/likes.slice";
import likesCommentSlice from "../slices/likesComment.slice";
import thunk from 'redux-thunk';

export default configureStore({
  // c'est ici que le reducer prend son nom // 
  reducer: {
    auth:   authSlice,
    tweets: tweetsSlice,
    comments: commentsSlice,
    likes:likesSlice,
    likesComment: likesCommentSlice

  },
  middleware: [thunk], 
});
