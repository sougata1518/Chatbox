import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UsernameCard from './Component/UsernameCard';
import ChatBox from './Component/ChatBox';

const App = () => {
  const [user, setUser] = useState('');

  return (
    <Routes>
      <Route path='/' element={<UsernameCard />} />
      <Route path='/chat-box' element={<ChatBox />} />
    </Routes>
  );
};

export default App;
