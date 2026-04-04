import React, { useState } from 'react';

const Messages = ({ likedUsers }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState({});

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
    setChats(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), { from: 'me', text: input, time: 'now' }],
    }));
    setInput('');
    // Simulate reply
    setTimeout(() => {
      const replies = ["Hey! 😊", "That's so cool!", "Tell me more!", "Love that ✨", "Haha absolutely!"];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setChats(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), { from: 'them', text: reply, time: 'now' }],
      }));
    }, 1000);
  };

  if (activeChat) {
    const messages = chats[activeChat.id] || [];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        {/* Chat Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #1a1a2e' }}>
          <button onClick={() => setActiveChat(null)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 20, cursor: 'pointer' }}>←</button>
          <img src={activeChat.avatar} alt={activeChat.name} style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #ff4d6d' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{activeChat.name}</div>
            <div style={{ fontSize: 11, color: '#4ecdc4' }}>● Online</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#444', marginBottom: 8 }}>You matched with {activeChat.name.split(' ')[0]}! Say hi 👋</div>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
              {msg.from === 'them' && <img src={activeChat.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />}
              <div style={{ maxWidth: '72%', background: msg.from === 'me' ? 'linear-gradient(135deg, #ff4d6d, #ff8c32)' : '#1a1a2e', borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '10px 14px', fontSize: 14 }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #1a1a2e', display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Send a message..."
            style={{ flex: 1, background: '#1a1a2e', border: '1px solid #333', color: '#fff', padding: '10px 14px', borderRadius: 24, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }}
          />
          <button onClick={sendMessage} style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d6d, #ff8c32)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>➤</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Messages</div>
      {likedUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#444' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No matches yet</div>
          <div style={{ fontSize: 13 }}>Go to Match tab to find your Spark!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {likedUsers.map((u, i) => (
            <div key={i} onClick={() => setActiveChat(u)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px', borderRadius: 14, cursor: 'pointer', background: '#111118', transition: 'background 0.15s' }}>
              <div style={{ position: 'relative' }}>
                <img src={u.avatar} alt={u.name} style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid #ff4d6d' }} />
                <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, background: '#4ecdc4', borderRadius: '50%', border: '2px solid #111118' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                  {chats[u.id]?.length ? chats[u.id][chats[u.id].length - 1].text : `Say hi to ${u.name.split(' ')[0]}! 👋`}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#444' }}>now</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
