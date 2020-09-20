import React from 'react';
import { connect } from 'react-redux';

import './css/message.css';

const Message = (props) => {
  return(
    <div class="isa_error message">
      Replace this text with your own text.
      <i>
        <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
          <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
        </svg>
      </i>
    </div>
  );
}

export default Message;