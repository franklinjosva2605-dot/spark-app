import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const Search = ({ session }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    const { data } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', session.user.id);
    if (data) setFollowing(new Set(data.map(f => f.following_id)));
  };

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length < 2) { setResults([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', session.user.id)
      .or('username.ilike.%' + text + '%,display_name.ilike.%' + text + '%')
      .limit(20);
    setResults(data || []);
    setLoading(false);
  };

  const toggleFollow = async (userId) => {
    if (following.has(userId)) {
      await supabase.from('follows').delete()
        .eq('follower_id', session.user.id)
        .eq('following_id', userId);
      setFollowing(prev => { const s = new Set(prev); s.delete(userId); return s; });
    } else {
      await supabase.from('follows').insert({
        follower_id: session.user.id,
        following_id: userId,
      });
      setFollowing(prev => new Set([...prev, userId]));
    }
  };

  const startChat = async (user) => {
    alert('Go to Messages tab to chat with ' + user.display_name);
  };

  return (
    <div style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Search</div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
        <input
          placeholder="Search people by name or username..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: '100%', background: '#1a1a2e', border: '1.5px solid #2a2a3e', color: '#fff', padding: '14px 14px 14px 42px', borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {loading && <div style={{ color: '#666', textAlign: 'center', padding: 20 }}>Searching...</div>}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>😕</div>
          No users found for "{query}"
        </div>
      )}

      {results.map(user => (
        <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 12px', background: '#111118', borderRadius: 14, marginBottom: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#ff4d6d,#ff8c32)', padding: 2, flexShrink: 0 }}>
            {user.avatar_url
              ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #111118', display: 'block' }} />
              : <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '2px solid #111118' }}>{user.display_name?.[0]?.toUpperCase()}</div>
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{user.display_name}</div>
            <div style={{ color: '#ff4d6d', fontSize: 13 }}>@{user.username}</div>
            {user.bio && <div style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{user.bio}</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              onClick={() => toggleFollow(user.id)}
              style={{ padding: '7px 14px', background: following.has(user.id) ? '#1a1a2e' : 'linear-gradient(135deg,#ff4d6d,#ff8c32)', border: following.has(user.id) ? '1px solid #ff4d6d' : 'none', borderRadius: 20, color: following.has(user.id) ? '#ff4d6d' : '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {following.has(user.id) ? 'Following' : 'Follow'}
            </button>
            <button
              onClick={() => startChat(user)}
              style={{ padding: '7px 14px', background: '#1a1a2e', border: '1px solid #333', borderRadius: 20, color: '#aaa', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              💬 Message
            </button>
          </div>
        </div>
      ))}

      {!query && (
        <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Find People</div>
          <div style={{ fontSize: 13 }}>Search by name or @username</div>
        </div>
      )}
    </div>
  );
};

export default Search;