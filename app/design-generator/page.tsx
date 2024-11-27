'use client'

// pages/design-generator.tsx
import { useState, ChangeEvent } from 'react';

const DesignGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload an image.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedCode('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Make a POST request to the backend
      const response = await fetch('/api/generate-design', {
        method: 'POST', // Ensure method is POST
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Something went wrong while processing the image.');
      }

      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (err: any) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Design Generator</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Generate Design'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {generatedCode && (
        <div>
          <h2>Generated Code</h2>
          <pre>{generatedCode}</pre>
        </div>
      )}
    </div>
  );
};

export default DesignGenerator;
