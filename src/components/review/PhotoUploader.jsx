import React, { useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, X, User, Plus } from "lucide-react";

export default function PhotoUploader({
  previews,
  onDrop,
  onRemove,
  type = "review",
}) {
  const isProfileType = type === "profile";
  
  // 1. 스크롤 컨테이너를 가리킬 Ref 생성
  const scrollRef = useRef(null);

  // 2. previews 배열이 변할 때마다(사진이 추가될 때마다) 스크롤 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth", // 부드럽게 스윽 이동
      });
    }
  }, [previews]); // 사진 개수가 바뀔 때마다 실행

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: !isProfileType,
  });

  return (
    <div className={`flex items-center gap-3 w-full ${isProfileType ? "justify-center" : ""}`}>
      
      {/* 업로드 버튼 (고정) */}
      <div
        {...getRootProps()}
        className={`w-28 h-28 rounded-[2.5rem] flex flex-col items-center justify-center 
        cursor-pointer transition-all relative overflow-hidden group outline-none shrink-0
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-100 bg-white"} 
        border-2 border-dashed shadow-sm`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
            <Plus size={24} className="text-slate-300" strokeWidth={3} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Add Photo</p>
        </div>
      </div>

      {/* 3. 사진 리스트 (Ref 연결 및 스크롤 설정) */}
      {!isProfileType && previews && previews.length > 0 && (
        <div 
          ref={scrollRef} // Ref 연결
          className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 pr-4 flex-1 scroll-smooth"
        >
          {previews.map((preview, index) => (
            <div
              key={index}
              className="w-24 h-24 rounded-[2rem] overflow-hidden relative border-2 border-white shadow-md flex-shrink-0 animate-in zoom-in duration-300"
            >
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="absolute top-1.5 right-1.5 bg-slate-900/80 text-white rounded-xl p-1.5 backdrop-blur-md"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}