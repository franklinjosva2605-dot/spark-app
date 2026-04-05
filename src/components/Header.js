import React from 'react';

const Header = ({ tab, setTab, onLogout }) => {
  const navItems = [
    { id: 'feed', icon: 'fas fa-home', label: 'Feed' },
    { id: 'search', icon: 'fas fa-search', label: 'Search' },
    { id: 'discover', icon: 'fas fa-fire', label: 'Match' },
    { id: 'messages', icon: 'fas fa-comment-dots', label: 'Messages' },
    { id: 'profile', icon: 'fas fa-user', label: 'Profile' },
  ];

  return (
    <div style={{
      padding: '12px 16px 8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#0a0a0f',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      borderBottom: '1px solid #1a1a2e',
    }}>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, background: 'linear-gradient(90deg, #ff4d6d, #ff8c32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ✦ Spark
      </span>
      <div style={{ display: 'flex', gap: 2 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              background: tab === item.id ? '#ff4d6d22' : 'transparent',
              border: 'none',
              color: tab === item.id ? '#ff4d6d' : '#666',
              fontSize: 11,
              padding: '6px 8px',
              borderRadius: 16,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <i className={item.icon} style={{ fontSize: 16 }} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;