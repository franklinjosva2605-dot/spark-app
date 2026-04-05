import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

const Messages = ({ session }) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      const sub = supabase
        .channel('messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          if (payload.new.sender_id === activeChat.id || payload.new.receiver_id === activeChat.id) {
            setMessages(prev => [...prev, payload.new]);
          }
        })
        .subscribe();
      return () => supabase.removeChannel(sub);
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or('sender_id.eq.' + session.user.id + ',receiver_id.eq.' + session.user.id)
      .order('created_at', { ascending: false });

    if (data) {
      const seen = new Set();
      const convos = [];
      for (const msg of data) {
        const otherId = msg.sender_id === session.user.id ? msg.receiver_id : msg.sender_id;
        if (!seen.has(otherId)) {
          seen.add(otherId);
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', otherId).single();
          if (profile) convos.push({ ...profile, lastMessage: msg.content });
        }
      }
      setConversations(convos);
    }
    setLoading(false);
  };

  const fetchMessages = async (otherId) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or('and(sender_id.eq.' + session.user.id + ',receiver_id.eq.' + otherId + '),and(sender_id.eq.' + otherId + ',receiver_id.eq.' + session.user.id + ')')
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;
    const text = input;
    setInput('');
    await supabase.from('messages').insert({
      sender_id: session.user.id,
      receiver_id: activeChat.id,
      content: text,
    });
    fetchMessages(activeChat.id);
  };

  if (activeChat) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)', fontFamily: "'DM Sans', sans-serif" }}>
        {/* Chat Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #1a1a2e' }}>
          <button onClick={() => { setActiveChat(null); fetchConversations(); }} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 22, cursor: 'pointer' }}>←</button>
          <div style={{ background: 'linear-gradient(135deg,#ff4d6d,#ff8c32)', padding: 2, borderRadius: '50%' }}>
            <img src={activeChat.avatar_url || 'https://i.pravatar.cc/40'} alt="" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #0a0a0f', display: 'block', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{activeChat.display_name}</div>
            <div style={{ fontSize: 11, color: '#4ecdc4' }}>@{activeChat.username}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#444', marginTop: 40 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>👋</div>
              Say hi to {activeChat.display_name}!
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.sender_id === session.user.id;
            return (
              <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '72%', background: isMe ? 'linear-gradient(135deg,#ff4d6d,#ff8c32)' : '#1a1a2e', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '10px 14px', fontSize: 14 }}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #1a1a2e', display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Send a message..."
            style={{ flex: 1, background: '#1a1a2e', border: '1px solid #333', color: '#fff', padding: '12px 16px', borderRadius: 24, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }}
          />
          <button onClick={sendMessage} style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#ff4d6d,#ff8c32)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Messages</div>
      {loading && <div style={{ color: '#666', textAlign: 'center', padding: 40 }}>Loading...</div>}
      {!loading && conversations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#444' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No messages yet</div>
          <div style={{ fontSize: 13 }}>Search for people and start chatting!</div>
        </div>
      )}
      {conversations.map((conv, i) => (
        <div key={i} onClick={() => setActiveChat(conv)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px', background: '#111118', borderRadius: 14, marginBottom: 10, cursor: 'pointer' }}>
          <div style={{ position: 'relative' }}>
            <img src={conv.avatar_url || 'https://i.pravatar.cc/52'} alt="" style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid #ff4d6d', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, background: '#4ecdc4', borderRadius: '50%', border: '2px solid #111118' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{conv.display_name}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{conv.lastMessage}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;