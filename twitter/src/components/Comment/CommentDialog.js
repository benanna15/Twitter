import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "@material-tailwind/react";
import Comment from "./Comment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTimes } from '@fortawesome/free-solid-svg-icons';


export function CommentDialog({  id, isOpen, onClose, tweetedId}) {

   
  return  (
    
      
    <Dialog open={isOpen}  
    
    animate={{
      mount: { scale: 1, y: 0 , opacity: 1},
      unmount: { scale: 0.9, y: -100 , opacity: 0},
      
    }}
    
    className="overflow-scroll " 
  >
  <button onClick={onClose} className="absolute end-3.5 top-1.5 font-semibold"><FontAwesomeIcon icon={faTimes} className="text-xl" /></button>
        {/* Ajoutez votre contenu ici */}
        <Comment  id={id} tweetedId={tweetedId}   />

        {/* Si vous avez un bouton de fermeture à l'intérieur du Dialog */}
       
     
  </Dialog>
 )
}

export default CommentDialog
