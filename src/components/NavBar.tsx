import React from "react";

export function NavBar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <svg
            width="36"
            height="36"
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
            <path
              d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z"
              fill="white"
            />
            <path
              d="M89.3333 38.6667H38.6667V89.3334H89.3333V38.6667Z"
              fill="#3C46FF"
            />
            <path
              d="M64 76C70.6274 76 76 70.6274 76 64C76 57.3726 70.6274 52 64 52C57.3726 52 52 57.3726 52 64C52 70.6274 57.3726 76 64 76Z"
              fill="white"
            />
          </svg>
          <span className="text-2xl font-bold text-white">Deepgram Usage</span>
        </div>
        <div>
          <a
            href="https://github.com/deepgram/deepgram-js-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/30 hover:shadow-md"
          >
            Documentation
          </a>
        </div>
      </div>
    </nav>
  );
}