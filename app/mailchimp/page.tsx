"use client"
// components/mailchimp.tsx
import { useState, FormEvent } from 'react';
import jsonp from 'jsonp';

export default function mailchimp() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;
    if (!url) {
      console.error('Mailchimp URL is missing');
      setLoading(false);
      return;
    }

    jsonp(`${url}&EMAIL=${email}`, { param: 'c' }, (_, response) => {
      const msg = response?.msg ?? 'An error occurred';
      alert(msg);
      setLoading(false);
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center max-w-xs p-6 space-y-4 bg-white rounded shadow-md"
      >
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
    </div>
  );
}
