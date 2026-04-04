import React from 'react';
import { MOCK_USERS } from '../data/mockData';

const Feed = ({ posts, setPosts, comments, setComments, setOpenPost }) => {
  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  return (
    <div style={{ padding: '12px 16px' }}>
      {/* Stories Row */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 14, marginBottom: 12 }}>
        {/* Add Story */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1a1a2e', border: '2px dashed #ff4d6d', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span style={{ color: '#ff4d6d', fontSize: 22 }}>+</span>
          </div>
          <span style={{ fontSize: 10, color: '#aaa' }}>Your Story</span>
        </div>
        {MOCK_USERS.map(u => (
          <div key={u.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0, cursor: 'pointer' }}>
            <div style={{ background: 'linear-gradient(135deg, #ff4d6d, #ff8c32)', padding: 2, borderRadius: '50%' }}>
              <img src={u.avatar} alt={u.name} style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid #0a0a0f', display: 'block' }} />
            </div>
            <span style={{ fontSize: 10, color: '#aaa', maxWidth: 56, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {u.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Posts */}
      {posts.map(post => (
        <div key={post.id} style={{ background: '#111118', borderRadius: 16, marginBottom: 14, overflow: 'hidden' }}>
          {/* Post Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
            <div style={{ background: 'linear-gradient(135deg, #ff4d6d, #ff8c32)', padding: 2, borderRadius: '50%' }}>
              <img src={post.avatar} alt={post.user} style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #111118', display: 'block' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{post.user}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{post.time} ago</div>
            </div>
            <span style={{ fontSize: 18, color: '#444', cursor: 'pointer' }}>···</span>
          </div>

          {/* Media */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setOpenPost(post)}>
            <img src={post.thumbnail} alt="post" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 52, height: 52, background: 'rgba(0,0,0,0.55)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                <i className="fas fa-play" style={{ color: '#fff', fontSize: 18, marginLeft: 4 }} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <button onClick={() => toggleLike(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.15s' }}>
                <i className={post.liked ? 'fas fa-heart' : 'far fa-heart'} style={{ fontSize: 22, color: post.liked ? '#ff4d6d' : '#aaa' }} />
              </button>
              <button onClick={() => setOpenPost(post)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="far fa-comment" style={{ fontSize: 21, color: '#aaa' }} />
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="far fa-paper-plane" style={{ fontSize: 20, color: '#aaa' }} />
              </button>
              <div style={{ flex: 1 }} />
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="far fa-bookmark" style={{ fontSize: 20, color: '#aaa' }} />
              </button>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{post.likes.toLocaleString()} likes</div>
            <div style={{ fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>{post.user}</span> {post.caption}
            </div>
            {(comments[post.id]?.length || 0) > 0 && (
              <button onClick={() => setOpenPost(post)} style={{ background: 'none', border: 'none', color: '#666', fontSize: 12, cursor: 'pointer', padding: 0, marginTop: 4 }}>
                View all {comments[post.id].length} comments
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
