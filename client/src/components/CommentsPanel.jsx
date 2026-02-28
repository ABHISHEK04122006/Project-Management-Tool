import React, { useState } from "react";

export default function CommentsPanel({ item, onAddComment }) {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");

  if (!item) {
    return <div className="comments-empty">Select a task or project.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author || !body) return;
    onAddComment(item, { author, body });
    setAuthor("");
    setBody("");
  };

  return (
    <div className="comments-panel">
      <h3>Comments for: {item.title || item.name}</h3>
      <div className="comments-list">
        {item.comments && item.comments.length > 0 ? (
          item.comments.map((c) => (
            <div key={c._id || c.createdAt} className="comment">
              <div className="comment-header">
                <strong>{c.author}</strong>
                <span>
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>
              <div>{c.body}</div>
            </div>
          ))
        ) : (
          <div className="comments-empty">No comments yet.</div>
        )}
      </div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Write a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}

