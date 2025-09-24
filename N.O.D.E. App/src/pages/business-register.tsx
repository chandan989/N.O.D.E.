import React from 'react';
import { Link } from 'react-router-dom';
import { WindowPanel } from '@/components/ui/window-panel';

const BusinessRegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <WindowPanel title="BUSINESS REGISTRATION" className="w-full max-w-md">
        <div className="p-8">
          <form>
            <div className="mb-4">
              <label htmlFor="business-name" className="block text-glow mb-2">BUSINESS NAME</label>
              <input type="text" id="business-name" className="w-full p-2 bg-black border border-gray-700 rounded-md text-white" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-glow mb-2">EMAIL</label>
              <input type="email" id="email" className="w-full p-2 bg-black border border-gray-700 rounded-md text-white" />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-glow mb-2">PASSWORD</label>
              <input type="password" id="password" className="w-full p-2 bg-black border border-gray-700 rounded-md text-white" />
            </div>
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-glow mb-2">CONFIRM PASSWORD</label>
              <input type="password" id="confirm-password" className="w-full p-2 bg-black border border-gray-700 rounded-md text-white" />
            </div>
            <button type="submit" className="btn-retro w-full mb-4">[REGISTER]</button>
          </form>
          <div className="text-center">
            <p className="mt-4 text-gray-400">
              ALREADY HAVE A BUSINESS ACCOUNT? <Link to="/business-login" className="text-glow hover:underline">LOGIN</Link>
            </p>
          </div>
        </div>
      </WindowPanel>
    </div>
  );
};

export default BusinessRegisterPage;
