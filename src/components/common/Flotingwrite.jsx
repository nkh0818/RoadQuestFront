import { Plus } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Flotingwrite({ restAreaId }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (restAreaId && restAreaId !== "undefined") {
            navigate(`/review/write/${restAreaId}`);
        } else {
            navigate(`/review/write/new`);
        }
    };
  return (
    <button 
          onClick={handleClick}
        className="fixed bottom-25 left-1/2 z-[100]
    -translate-x-[-275px] group w-12 h-12 bg-blue-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-white hover:text-slate-900 transition-all duration-500 active:scale-90">
          <Plus 
            size={28} 
            className="group-hover:rotate-180 transition-transform duration-500 ease-in-out" 
            strokeWidth={3} 
          />
        </button>
  )
}
