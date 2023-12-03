// DialogDefault.js (par exemple)
import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';


export function ConfirmationModal({ isOpen, onCancel, onConfirm  }) {
  return (
  
   
    <Dialog
    

      open={isOpen}
      onClose={onCancel}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
        
      }}

    >
      <DialogHeader className="flex justify-center text-4xl">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </DialogHeader >
      <DialogBody className="flex justify-center font-medium text-xl text-black">Are you sure you want to delete this tweet?</DialogBody>
      <DialogFooter>
        <Button variant="gradient" color="red" onClick={onCancel} className="mr-7">
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={onConfirm}>
          <span className="text-green-900">Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
   
  );
}

export default ConfirmationModal;