import React, { useState, useRef } from 'react';
import { MOCK_USERS } from '../data/mockData';

const Discover = ({ likedUsers, setLikedUsers, setMatchedUser }) => {
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const dragStartX = useRef(null);
  const cardRef = useRef(null);

  const currentUser = MOCK_USERS[swipeIndex % MOCK_USERS.length];

  const handleSwipe = (dir) => {
    setSwipeDir(dir);
    setTimeout(() => {
      if (dir === 'right') {
        setMatchedUser(currentUser);
        setLikedUsers(prev => [...prev, currentUser]);
      }
      setSwipeIndex(i => i + 1);
      setSwipeDir(null);
    }, 380);
  };

  const handleDragStart = (e) => {
    dragStartX.current = e.clientX || e.touches?.[0]?.clientX;
  };

  const handleDragEnd = (e) => {
    if (dragStartX.current === null) return;
    const endX = e.clientX || e.changedTouches?.[0]?.clientX;
    const diff = endX - dragStartX.current;
    if (Math.abs(diff) > 60) handleSwipe(diff > 0 ? 'right' : 'left');
    dragStartX.current = null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px', gap: 20 }}>
      <style>{`
        .swipe-left { animation: swipeLeft 0.38s ease forwards; }
        .swipe-right { animation: swipeRight 0.38s ease forwards; }
        @keyframes swipeLeft { to { transform: translateX(-130%) rotate(-22deg); opacity: 0; } }
        @keyframes swipeRight { to { transform: translateX(130%) rotate(22deg); opacity: 0; } }
      `}</style>

      <div style={{ fontSize: 13, color: '#666', letterSpacing: 1, textTransform: 'uppercase' }}>Discover People Near You</div>

      {/* Card */}
      <div
        ref={cardRef}
        className={swipeDir === 'left' ? 'swipe-left' : swipeDir === 'right' ? 'swipe-right' : ''}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        style={{
          width: '100%', maxWidth: 360, background: '#111118', borderRadius: 24,
          overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          position: 'relative', cursor: 'grab', userSelect: 'none',
        }}
      >
        <div style={{ height: 460, position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
          <img src={currentUser.avatar} alt={currentUser.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)' }} />
          <div style={{ position: 'relative', padding: '24px 20px', width: '100%' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800 }}>{currentUser.name}, {currentUser.age}</div>
            <div style={{ fontSize: 13, color: '#ddd', marginTop: 2 }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: 5, color: '#ff4d6d' }} />{currentUser.location}
            </div>
            <div style={{ fontSize: 14, color: '#ccc', marginTop: 8 }}>{currentUser.bio}</div>
            <div style={{ display: 'flex', gap: 24, marginTop: 14 }}>
              {[['posts', currentUser.posts], ['followers', currentUser.followers], ['following', currentUser.following]].map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}</div>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'capitalize' }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <button onClick={() => handleSwipe('left')} style={{ width: 60, height: 60, borderRadius: '50%', background: '#1a1a2e', border: '2px solid #ff4d6d', color: '#ff4d6d', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>✕</button>
        <button style={{ width: 46, height: 46, borderRadius: '50%', background: '#ff8c3222', border: '2px solid #ff8c32', color: '#ff8c32', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⭐</button>
        <button onClick={() => handleSwipe('right')} style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d6d, #ff8c32)', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(255,77,109,0.4)', transition: 'all 0.2s' }}>♥</button>
      </div>

      {/* Drag hint */}
      <div style={{ fontSize: 12, color: '#444', textAlign: 'center' }}>← Drag card to swipe or use buttons →</div>

      {/* Liked users */}
      {likedUsers.length > 0 && (
        <div style={{ width: '100%', background: '#111118', borderRadius: 16, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>❤️ Your Likes</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {likedUsers.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1a2e', padding: '6px 12px', borderRadius: 30 }}>
                <img src={u.avatar} alt={u.name} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                <span style={{ fontSize: 13 }}>{u.name.split(' ')[0]}</span>
                <span style={{ color: '#ff4d6d' }}>♥</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
