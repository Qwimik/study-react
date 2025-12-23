import React, { useState } from 'react';
import Login from '../../components/Login';
import Register from '../../components/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <Login onToggleForm={() => setIsLogin(false)} />
      ) : (
        <Register onToggleForm={() => setIsLogin(true)} />
      )}
    </>
  );
};

export default AuthPage;

