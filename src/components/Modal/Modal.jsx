import { useEffect } from 'react';

import css from './Modal.module.css';

const Modal = ({ toggleModal, children, onClick }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  function handleKeyDown(event) {
    if (event.code === 'Escape') {
      toggleModal(); // Call the toggleModal method to close the modal
    }
  }

  return (
    <div className={css.overlay} onClick={onClick}>
      <div className={css.modal}>{children}</div>
    </div>
  );
};

export default Modal;
