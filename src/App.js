import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './components/Auth';
import ProfileSetup from './components/ProfileSetup';
import Header from './components/Header';
import Feed from './components/Feed';
import Search from './components/Search';
import Discover from './components/Discover';
import Messages from './components/Messages';
import Profile from './components/Profile';
import CommentsOverlay from './components/CommentsOverlay';
import MatchOverlay from './components/MatchOverlay';
import { INITIAL_POSTS, INITIAL_COMMENTS } from './data/mockData';

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('feed');
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [openPost, setOpenPost] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, background: 'linear-gradient(90deg, #ff4d6d, #ff8c32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦ Spark</div>
    </div>
  );

  if (!session) return <Auth onLogin={() => {}} />;

  if (!profile) return <ProfileSetup session={session} onComplete={() => fetchProfile(session.user.id)} />;

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#fff', maxWidth: 430, margin: '0 auto', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <Header tab={tab} setTab={setTab} onLogout={handleLogout} />
      <div style={{ height: 'calc(100vh - 72px)', overflowY: 'auto' }}>
        {tab === 'feed' && <Feed posts={posts} setPosts={setPosts} comments={comments} setComments={setComments} setOpenPost={setOpenPost} />}
        {tab === 'search' && <Search session={session} />}
        {tab === 'discover' && <Discover likedUsers={likedUsers} setLikedUsers={setLikedUsers} setMatchedUser={setMatchedUser} />}
        {tab === 'messages' && <Messages likedUsers={likedUsers} session={session} />}
        {tab === 'profile' && <Profile likedUsers={likedUsers} posts={posts} session={session} profile={profile} onLogout={handleLogout} />}
      </div>
      {openPost && <CommentsOverlay post={posts.find(p => p.id === openPost.id) || openPost} comments={comments} setComments={setComments} setPosts={setPosts} onClose={() => setOpenPost(null)} />}
      {matchedUser && <MatchOverlay matchedUser={matchedUser} onClose={() => setMatchedUser(null)} onMessage={() => { setMatchedUser(null); setTab('messages'); }} />}
    </div>
  );
}

export default App;