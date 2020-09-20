import React from 'react';

import Modal from 'react-modal';

import './css/loading.css';

const customStyles = {
  content : {
    top                   : '30%',
    left                  : '35%',
    width                 : '30%',
    height                : 'fit-content',
    border                : 'none'
  }
};

export default function Loading(props) {
  return(
    <Modal style={customStyles} isOpen={true} shouldCloseOnOverlayClick={false} >
      <div className="loading-container">
        <div className="sk-chase">
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
        </div>
        <span className="loading-text">{props.message}</span>
      </div>
    </Modal>
  );
}