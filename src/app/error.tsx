'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#ff5555' }}>
      <h2>Something went wrong!</h2>
      <p style={{ color: '#aaa', fontSize: '0.9em', marginTop: '0.5rem' }}>
        {error.message}
      </p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#39FF14',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
} 