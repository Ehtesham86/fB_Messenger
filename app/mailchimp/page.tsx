"use client"
// components/Mailchimp.tsx
import { useState, FormEvent } from 'react';
import jsonp from 'jsonp';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

interface MailchimpProps {
  closeModal: () => void;
}

export default function Mailchimp({ closeModal }: MailchimpProps) {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;
    if (!url) {
      console.error('Mailchimp URL is missing');
      setLoading(false);
      return;
    }

    jsonp(`${url}&EMAIL=${email}`, { param: 'c' }, (_, response) => {
      const msg = response?.msg ?? 'An error occurred';
      if (response?.result === 'success') {
        setSuccess(true);
        setTimeout(() => closeModal(), 2000); // Automatically close after 2 seconds
      } else {
        setError(msg);
      }
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col items-center max-w-xs mx-auto space-y-4">
      {error && (
        <div className="text-red-500 flex items-center space-x-2 mb-4">
          <AiOutlineExclamationCircle />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="text-green-500 flex items-center space-x-2 mb-4">
          <span>Successfully subscribed! We'll be in touch.</span>
        </div>
      )}
      {!success && (
        <form onSubmit={onSubmit} className="w-full space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className={`w-full py-2 text-white bg-black rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 active:bg-gray-600'}`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
}
