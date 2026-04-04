import React, { useState } from 'react';

const CommentsOverlay = ({ post, comments, setComments, setPosts, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const postComments = comments[post.id] || [];

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => ({
      ...prev,
      [post.id]: [...(prev[post.id] || []), { user: 'You', text: newComment, avatar: 'https://i.pravatar.cc/40?img=12' }],
    }));
    setNewComment('');
  };

  const toggleLike = () => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 100, display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 12px', borderBottom: '1px solid #1a1a2e' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 22, cursor: 'pointer' }}>←</button>
        <span style={{ fontWeight: 600, fontSize: 16 }}>Comments</span>
      </div>

      {/* Post Preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #1a1a2e' }}>
        <img src={post.thumbnail} alt="post" style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{post.user}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{post.caption}</div>
        </div>
        <button onClick={toggleLike} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <i className={post.liked ? 'fas fa-heart' : 'far fa-heart'} style={{ fontSize: 20, color: post.liked ? '#ff4d6d' : '#aaa' }} />
        </button>
      </div>

      {/* Comments List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {postComments.length === 0 && (
          <div style={{ color: '#444', textAlign: 'center', marginTop: 30, fontSize: 14 }}>No comments yet. Be the first! 💬</div>
        )}
        {postComments.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <img src={c.avatar} alt={c.user} style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ background: '#1a1a2e', borderRadius: '0 14px 14px 14px', padding: '8px 12px', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: '#ff8c32', marginBottom: 2 }}>{c.user}</div>
              <div style={{ fontSize: 13 }}>{c.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1a1a2e', display: 'flex', gap: 10, alignItems: 'center' }}>
        <img src="https://i.pravatar.cc/40?img=12" alt="me" style={{ width: 34, height: 34, borderRadius: '50%' }} />
        <input
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addComment()}
          style={{ flex: 1, background: '#1a1a2e', border: '1px solid #333', color: '#fff', padding: '10px 14px', borderRadius: 24, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }}
        />
        <button onClick={addComment} style={{ padding: '8px 16px', background: 'linear-gradient(90deg, #ff4d6d, #ff8c32)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, borderRadius: 20, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Post</button>
      </div>
    </div>
  );
};

export default CommentsOverlay;
