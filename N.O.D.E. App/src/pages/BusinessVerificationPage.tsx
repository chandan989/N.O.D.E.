import React, { useState } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user-store';

const BusinessVerificationPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { setVerificationStatus } = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle file uploads and submission to the backend
    setVerificationStatus('pending');
    setIsSubmitted(true);
  };

  const handleOkClick = () => {
    navigate('/business/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <WindowPanel title="BUSINESS VERIFICATION" className="w-full max-w-2xl">
        <div className="p-8">
          {isSubmitted ? (
            <div className="text-center">
              <h2 className="text-2xl text-glow mb-4">SUBMISSION RECEIVED</h2>
              <p className="text-gray-400 mb-6">Your documents are under review. This process may take up to 3-5 business days. You will be notified via email once the review is complete.</p>
              <button onClick={handleOkClick} className="btn-retro">[OK]</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="incorporation-cert" className="block text-glow mb-2">INCORPORATION CERTIFICATE</label>
                <input type="file" id="incorporation-cert" className="w-full p-2 bg-black border border-gray-700 rounded-md text-white" />
              </div>
              <div className="mb-6">
                <label htmlFor="id-cert" className="block text-glow mb-2">OWNER IDENTIFICATION</label>
                <input type="file" id="id-cert" className="w-full p-2 bg-black border border-gray-700 rounded-md text-white" />
              </div>
              <div className="mb-8">
                <label htmlFor="tax-returns" className="block text-glow mb-2">LATEST TAX RETURNS</label>
                <input type="file" id="tax-returns" className="w-full p-2 bg-black border border-gray-700 rounded-md text-white" />
              </div>
              <button type="submit" className="btn-retro w-full">[SUBMIT FOR VERIFICATION]</button>
            </form>
          )}
        </div>
      </WindowPanel>
    </div>
  );
};

export default BusinessVerificationPage;
