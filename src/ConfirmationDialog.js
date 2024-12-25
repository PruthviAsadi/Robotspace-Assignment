import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function ConfirmationDialog({ isOpen, onConfirm, onCancel, message }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel}>
      <h2>Confirmation</h2>
      <p>{message}</p>
      <div>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </Modal>
  );
}

export default ConfirmationDialog;
