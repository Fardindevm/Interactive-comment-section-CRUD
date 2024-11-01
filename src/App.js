import { useEffect, useState } from 'react';
import './App.css';
import Container from './components/Container.js'
import data from './data.json'
import Message from './components/Message.js'
import Footer from './components/Footer.js'
import arrow from './images/up-arrow-svgrepo-com.svg'
function App() {

  const [showFooter, setShowFooter] = useState(false)
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('comments');
    const initialComments = savedComments ? JSON.parse(savedComments) : data.comments;
    return initialComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  });

  const addReply = (commentId, newReply) => {
    const replyWithTimestamp = {
      ...newReply,
      id: Date.now(), // Generate a unique ID using timestamp
      createdAt: new Date().toISOString(),
      score: 0,
      replies: [], // empty replies array if needed
      user: data.currentUser // Add current user information
    };
    setComments(prevComments => {
      const updatedComments = prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), replyWithTimestamp]
          };
        }
        return comment;
      });
      localStorage.setItem('comments', JSON.stringify(updatedComments));
      return updatedComments;
    });
  };

  const handleAddComment = (newComment) => {
    const commentWithTimestamp = {
      ...newComment,
      createdAt: new Date().toISOString()
    };
    setComments(prevComments => [...prevComments, commentWithTimestamp]);
  };

  const editReply = (commentId, replyId, newContent) => {
    setComments(prevComments => {
      const updatedComments = prevComments.map(comment => {
        if (comment.id === commentId) {
          if (comment.replies.length > 0) {
            const updatedReplies = comment.replies.map(reply =>
              reply.id === replyId ? { ...reply, content: newContent } : reply
            );
            return { ...comment, replies: updatedReplies };
          } else {
            return { ...comment, content: newContent }
          }
        }
        return comment;
      });
      localStorage.setItem('comments', JSON.stringify(updatedComments));
      return updatedComments;
    });
  }

  const deleteReply = (commentId, replyId) => {
    setComments(prevComments => {
      let updatedComments
      if (commentId !== replyId) {
        updatedComments = prevComments.map(comment => {
          if (comment.id === commentId) {
            if (comment.replies.length > 0) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== replyId)
              };
            }
          }
          return comment;
        });
      } else {
        updatedComments = prevComments.filter(comment => comment.id !== replyId)
      }
      localStorage.setItem('comments', JSON.stringify(updatedComments));
      return updatedComments;
    });
  };
  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleScoreChange = (commentId, replyId, newScore) => {
    setComments(prevComments => {
      const updatedComments = prevComments.map(comment => {
        if (comment.id === commentId) {
          if (newScore) {
            // for reply
            const updatedReplies = comment.replies.map(reply =>
              reply.id === replyId ? { ...reply, score: newScore } : reply
            ).sort((a, b) => b.score - a.score); // Sort replies
            return { ...comment, replies: updatedReplies };
          } else {
            // for main comment
            return { ...comment, score: replyId };
          }
        }
        return comment;
      });
      localStorage.setItem('comments', JSON.stringify(updatedComments));
      return updatedComments;
    });
  };

  const handleFooter = () => {
    setShowFooter(!showFooter)
  }

  return (
    <>
    <div className="App">
      {comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(comment => (
          <Container
            key={comment.id}
            comment={comment}
            onAddReply={(newReply) => addReply(comment.id, newReply)}
            onEditReply={(replyId, newContent) => editReply(comment.id, replyId, newContent)}
            onDeleteReply={(replyId) => deleteReply(comment.id, replyId)}
            onScoreChange={handleScoreChange}
            data={data}
          />
        ))}
      <Message
        data={data.currentUser}
        onSubmit={handleAddComment}
        isMainComment={true}
        showMessage={true}
      />
    </div>
      <button className={`transition duration-300 ease-in-out ${showFooter ? "mb-10": ""}`} onClick={handleFooter}>
        <img className={`w-8 h-8 opacity-40 hover:opacity-80 transition duration-300 ease-in-out ${showFooter ? "rotate-180": ""}`} src={arrow} alt='footer-arrow'/>
      </button>
      <Footer showFooter={showFooter} />
    </>
  );
}




export default App;
