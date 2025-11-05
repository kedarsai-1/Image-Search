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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 2 4-8 3 2v8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Image Search</h1>
                  <p className="text-sm text-gray-600">Welcome back, {user.displayName || user.email}</p>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={async () => {
                  try {
                    await logout();
                    setUser(null);
                  } catch (error) {
                    console.error('Logout error:', error);
                    setUser(null); // Still clear user state even if logout fails
                  }
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-8">
        <SearchPage />
      </main>
    </div>
  );
}
