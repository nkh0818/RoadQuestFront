import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Header() {

  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-100">
      
      <Link 
        to="/" 
        className="text-xl font-black tracking-tighter text-gray-900 italic hover:opacity-70 transition-opacity cursor-pointer"
      > RoadQuest </Link>
      
      {/* 검색 아이콘 */}
      {!isSearchPage && (
        <Link 
          to="/search" 
          className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
        >
          <Search className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
        </Link>
      )}
    </header>
  );
}