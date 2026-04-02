import { ArrowLeft } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Backbutton() {

    const navigate = useNavigate();

  return (
    <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-[#A0AEC0] backdrop-blur-md rounded-full hover:bg-[#3182CE] active:scale-95 transition-all"
        >
          <ArrowLeft size={22} className="text-slate-800" strokeWidth={2.5} />
        </button>
  )
}
