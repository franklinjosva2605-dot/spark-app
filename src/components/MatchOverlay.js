import React from 'react';

const MatchOverlay = ({ matchedUser, onClose, onMessage }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, rgba(255,77,109,0.97), rgba(255,140,50,0.97))', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.25)', marginBottom: 6, textAlign: 'center' }}>
        It's a Spark! ✦
      </div>
      <div style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 40, fontSize: 15, textAlign: 'center', padding: '0 20px' }}>
        You and <strong>{matchedUser.name}</strong> liked each other
      </div>

      {/* Avatars */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 50 }}>
        <div style={{ position: 'relative' }}>
          <img src="https://i.pravatar.cc/100?img=12" alt="me" style={{ width: 96, height: 96, borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }} />
        </div>
        <div style={{ fontSize: 36, color: '#fff', animation: 'pulse 1s infinite', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>♥</div>
        <div style={{ position: 'relative' }}>
          <img src={matchedUser.avatar} alt={matchedUser.name} style={{ width: 96, height: 96, borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }} />
        </div>
      </div>

      <button
        onClick={onMessage}
        style={{ padding: '16px 48px', background: '#fff', border: 'none', color: '#ff4d6d', fontSize: 16, fontWeight: 700, borderRadius: 50, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 6px 24px rgba(0,0,0,0.2)', marginBottom: 14 }}
      >
        Send a Message 💬
      </button>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
        Keep Swiping →
      </button>
    </div>
  );
};

export default MatchOverlay;
