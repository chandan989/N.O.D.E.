import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WindowPanel } from '@/components/ui/window-panel';
import { useUserStore } from '@/stores/user-store';

const BusinessLoginPage = () => {
  const navigate = useNavigate();
  const { setUserType } = useUserStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add actual authentication logic here
    setUserType('business');
    navigate('/business/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <WindowPanel title="BUSINESS AUTHENTICATION" className="w-full max-w-md">
        <div className="p-8">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-glow mb-2">EMAIL</label>
              <input type="email" id="email" className="w-full p-2 bg-black border border-gray-700 rounded-md text-white" />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-glow mb-2">PASSWORD</label>
              <input type="password" id="password" className="w-full p-2 bg-black border border-gray-700 rounded-md text-white" />
            </div>
            <button type="submit" className="btn-retro w-full mb-4">[LOGIN]</button>
          </form>
          <div className="text-center">
            <Link to="/forgot-password" className="text-glow hover:underline">FORGOT PASSWORD?</Link>
            <p className="mt-4 text-gray-400">
              DON'T HAVE A BUSINESS ACCOUNT? <Link to="/business-signup" className="text-glow hover:underline">SIGN UP</Link>
            </p>
          </div>
        </div>
      </WindowPanel>
    </div>
  );
};

export default BusinessLoginPage;
