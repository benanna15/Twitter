import { createSlice } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
  },
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    


    },
    addComment: (state, action) => {
      const newComment = action.payload;
      state.comments.push(newComment);

      
    },
    updateComment: (state, action) => {
      const updatedComment = action.payload;

      state.comments = state.comments.map((comment) =>
    comment.id === updatedComment.id
      ? { ...comment, CommentContent: updatedComment.CommentContent, date: updatedComment.date }
      : comment
  );
  state.comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    deleteTheComment: (state, action) => {
      const deletedCommentId = action.payload;
  state.comments = state.comments.filter((comment) => comment.id !== deletedCommentId);
    },
    // Ajoutez d'autres reducers si nécessaire
  
    updateTotalLikesPerComment: (state, action) => {
      const { commentId, likeChange , redHeart} = action.payload;
    
      // Utilisez une copie du tableau pour éviter de modifier le state directement
      const updatedComments = state.comments.map((comment) =>
        comment.id === commentId ? { ...comment, like: likeChange ,redHeart:redHeart} : comment
      );
    
      return {
        ...state,
        comments: updatedComments,
        
      };
     
    },
  },

});

export const { setComments, addComment, updateComment, deleteTheComment, updateTotalLikesPerComment } = commentsSlice.actions;
export default commentsSlice.reducer;
