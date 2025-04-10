import React from 'react';

export function Footer() {
  return (
    <footer className="mt-auto bg-gray-50 py-8 text-center text-sm">
      <div className="container mx-auto px-6">
        <p className="text-gray-600">
          Deepgram Usage Dashboard &copy; {new Date().getFullYear()} | Built
          with{' '}
          <a
            href="https://deepgram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-800 hover:underline"
          >
            Deepgram
          </a>
          ,{' '}
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-800 hover:underline"
          >
            React
          </a>
          , and{' '}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 transition-colors hover:text-indigo-800 hover:underline"
          >
            Tailwind CSS
          </a>
        </p>
      </div>
    </footer>
  );
}
