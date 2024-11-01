import './Message.css'
import avatar from '../images/avatars/image-juliusomo.png'
import { useState } from 'react'
export default function Message({
  data,
  setShowMessage,
  onAddReply,
  onSubmit,
  showMessage,
  isMainComment = false 
}) {

  const [inputValue, setInputValue] = useState('');

  const calculateDate = () => {
    const now = new Date();
    console.log(now.getHours(), now.getSeconds())
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      const newMessage = {
        id: Date.now(), // Add a unique id
        content: inputValue,
        createdAt: calculateDate(), // Add creation time
        score: 0, // Initialize score
        user: {
          image: data.image,
          username: data.username
        },
        replies: []
      };
      if (isMainComment) {
        // If it's a main comment, use onSubmit
        onSubmit(newMessage);
      } else {
        // If it's a reply, use onAddReply
        onAddReply(newMessage);
        setShowMessage(false);
      }
      setInputValue('');
    }
  }

  const handleChange = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <>

      <form
        className={`container message ${showMessage ? "margin" : "lastOne"}`}
        onSubmit={handleSubmit}
      >
        <img
          className="message-avatar"
          src={avatar}
          alt="Your-avatar"
        />
        <textarea
          className='message-textarea'
          value={inputValue}
          placeholder={isMainComment ? 'Add a comment...' : 'Add a reply...'}
          onChange={handleChange}
        />
        <button
          className="submit-message-btn"
          type='submit'
        >
          {isMainComment ? 'SEND' : 'REPLY'}
        </button>
      </form>
    </>
  )
}
