import './Container.css'
import { useEffect, useState } from 'react'
import plus from '../images/icon-plus.svg'
import minus from '../images/icon-minus.svg'
import reply_icon from '../images/icon-reply.svg'
import Message from './Message'
import delete_icon from '../images/icon-delete.svg'
import edit_icon from '../images/icon-edit.svg'
import { formatTimeDifference } from './timeUtils'
import Modal from './Modal'

export default function Container({
  comment,
  onAddReply,
  onEditReply,
  onDeleteReply,
  onScoreChange,
  data
}) {
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
  const [isModalTrue, setIsModalTrue] = useState(false)
  const [timeAgo, setTimeAgo] = useState('');
  const [score, setScore] = useState(comment.score);
  const [showMessage, setShowMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(formatTimeDifference(comment.createdAt));
    };

    updateTime(); // Initial update
    const intervalId = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [comment.createdAt]);

  const handleScoreChange = (increment) => {
    const newScore = score + increment;
    setScore(newScore);
    onScoreChange(comment.id, newScore);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setIsDeleteButtonDisabled(true)
    } else {
      setIsDeleteButtonDisabled(false)
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim() !== '') {
      onEditReply(comment.id, editContent);
      setIsEditing(false);
    }
    if (isDeleteButtonDisabled) {
      setIsDeleteButtonDisabled(false)
    }
  };

  const handleDelete = () => {
    onDeleteReply(comment.id);
  };

  return (
    <div className={`container-main`}>
      <div className='container'>
        <div className='left-content'>
          <div className='scores'>
            <button className='scores-btn' onClick={() => handleScoreChange(1)}>
              <img src={plus} alt='plus-icon' />
            </button>
            <p className='scores-p'>{score}</p>
            <button className='scores-btn' onClick={() => handleScoreChange(-1)}>
              <img src={minus} alt='minus-icon' />
            </button>
          </div>
        </div>

        <div className='main-container'>
          <div className='information'>
            <div className='profile'>
              <img className="avatar" src={comment.user.image.png} alt={comment.user.username + "'s avatar"} />
              <p>{comment.user.username}{comment.user.username === data.currentUser.username && <span className='you'>you</span>}</p>
              <p className='time'>{!timeAgo.includes("NaN") ? timeAgo : comment.createdAt}</p>
            </div>
            {comment.user.username === data.currentUser.username ? (
              <div className='changes'>
                <button className='change-btn delete' disabled={isDeleteButtonDisabled} onClick={() => { setIsModalTrue(true) }}>
                  <img src={delete_icon} alt='delete_icon' />Delete
                </button>
                <button className='change-btn' onClick={handleEdit}>
                  <img src={edit_icon} alt='edit_icon' />Edit
                </button>
              </div>
            ) : (
              <div className='reply'>
                <button className='change-btn' onClick={() => setShowMessage(true)}>
                  <img src={reply_icon} alt='reply_icon' />Reply
                </button>
              </div>
            )}
          </div>
          <>
            {isEditing ? (
              <div className='textarea'>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className='message-textarea'
                  style={{ width: "82%" }}

                />
                <button className="submit-message-btn" onClick={handleSaveEdit}>SAVE</button>
              </div>
            ) : (
              <p className='content'>
                {comment.replyingTo && <span className='replyingTo'>@{comment.replyingTo}</span>} {comment.content}
              </p>
            )}
          </>
        </div>
      </div>
      {showMessage &&
        <Message
          data={data.currentUser}
          setShowMessage={setShowMessage}
          onAddReply={(newReply) => {
            onAddReply({ ...newReply, replyingTo: comment.user.username });
            setShowMessage(false);
          }}
          showMessage={showMessage}
          replyingTo={comment.user.username}
          isMainComment={false}  // Specify that this is a reply
        />
      }
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {comment.replies.sort((a, b) => b.score - a.score).map(reply =>
            <Container
              key={reply.id}
              comment={reply}
              onAddReply={onAddReply}
              onEditReply={onEditReply}
              onDeleteReply={onDeleteReply}
              onScoreChange={(replyId, newScore) => onScoreChange(comment.id, replyId, newScore)}
              data={data}
            />
          )}
        </div>
      )}
      {isModalTrue &&
        <Modal
          handleDelete={handleDelete}
          setIsModalTrue={setIsModalTrue}
        />
      }
    </div>
  )
}
