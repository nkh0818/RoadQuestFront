import React from 'react';

export default function TagFilterBar({ tags, activeTag, onTagChange }) {
  return (
    <section className="bg-white py-4 border-b border-slate-100 flex gap-2.5 px-5 overflow-x-auto scrollbar-hide sticky top-[60px] z-10">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] font-black transition-all ${
            activeTag === tag
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          {tag}
        </button>
      ))}
    </section>
  );
}
