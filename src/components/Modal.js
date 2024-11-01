import React from "react";
import './Modal.css' 

export default function Modal ({setIsModalTrue, handleDelete}) {

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="h2-modal">Delete comment</h2>
        <p className="p-modal">Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
        <div className="modal-buttons">
          <button className="modal-btn cancel-btn" onClick={() => setIsModalTrue(false)}>NO, CANCEL</button>
          <button className="modal-btn delete-btn" onClick={handleDelete}>YES, DELETE</button>
        </div>
      </div>
    </div>
  )
}