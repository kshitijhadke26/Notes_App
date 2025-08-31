import React from "react";

function Footer() {
  return (
    <footer className="mt-20 pt-8 border-t border-gray-200 text-center">
      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-purple-600">NoteFlow</span> — Capture more, forget less.
      </p>
      <div className="mt-3 flex justify-center space-x-6">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          className="text-gray-400 hover:text-purple-600 transition-colors"
        >
          Twitter
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="text-gray-400 hover:text-purple-600 transition-colors"
        >
          GitHub
        </a>
        <a
          href="/privacy"
          className="text-gray-400 hover:text-purple-600 transition-colors"
        >
          Privacy
        </a>
      </div>
    </footer>
  );
}

export default Footer;
