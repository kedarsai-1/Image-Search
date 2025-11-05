import React, { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import SearchPage from './components/SearchPage.jsx';
import { getUser, logout } from './api';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await getUser();
        if (r && r.user) setUser(r.user);
      } catch (e) {}
    })();
  }, []);

  if (!user) {
    return (
      <div className="p-5">
        <h2>Login</h2>
        <Login />
      </div>
    );
  }

  return (
    <div className="p-5">
      <div
        className="flex justify-between items-center"
      >
        <div>Welcome {user.displayName || user.email}</div>
        <div>
          <button
            onClick={async () => {
              await logout();
              setUser(null);
            }}
            className="bg-red-500 text-white p-2"
          >
            Logout
          </button>
        </div>
      </div>
      <SearchPage />
    </div>
  );
}
