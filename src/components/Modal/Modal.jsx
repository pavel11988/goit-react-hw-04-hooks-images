import { useEffect } from 'react';
import { Overlay, ModalWindow } from './Modal.styled';
import PropTypes from 'prop-types';

export default function Modal({ largeUrl, alt, onClose }) {
  useEffect(() => {
    window.addEventListener('keydown', handleEscapeDown);
    return () => {
      window.removeEventListener('keydown', handleEscapeDown);
    };
  });

  const handleEscapeDown = event => {
    if (event.code === 'Escape') {
      onClose();
    }
  };

  const handleOverlayClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalWindow>
        <img src={largeUrl} alt={alt} />
      </ModalWindow>
    </Overlay>
  );
}

Modal.propTypes = {
  largeUrl: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
