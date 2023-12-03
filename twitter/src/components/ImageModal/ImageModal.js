// ImageModal.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ImageModal = ({ src, onClose }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-4/5 max-h-4/5 bg-white p-8 rounded shadow-md">
      <img src={src} alt="Large Profile" className="max-h-96 max-w-96" />
      <button
        className="absolute top-2 right-2 text-black text-xl"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default ImageModal;
