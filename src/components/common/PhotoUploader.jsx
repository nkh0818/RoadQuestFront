import React, { useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Plus, Camera } from "lucide-react";

export default function PhotoUploader({
  previews,
  onDrop,
  onRemove,
  type = "review",
}) {
  const isProfileType = type === "profile";
  const hasPhotos = previews && previews.length > 0;
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && !isProfileType) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [previews, isProfileType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: !isProfileType,
  });

  return (
    <div className={`flex items-center gap-3 w-full ${isProfileType ? "justify-center h-full" : ""}`}>
      
      {/* 프로필 모드이면서 사진이 이미 있는 경우: 이미지 자체가 버튼이 됨 */}
      {isProfileType && hasPhotos ? (
        <div
          {...getRootProps()}
          className="relative w-full h-full cursor-pointer group overflow-hidden rounded-[2.8rem]"
        >
          <input {...getInputProps()} />
          {/* 부모에서 이미지를 보여주고 있다면 여기서는 '변경' 오버레이만 담당 */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-100 transition-opacity">
            <Camera size={24} className="text-white mb-1" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Change</span>
          </div>
        </div>
      ) : (
        /* 사진이 없거나 리뷰 모드일 때 보여주는 기본 'Add Photo' 버튼 */
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
      )}

      {/* 리뷰 모드용 사진 리스트 (가로 스크롤) */}
      {!isProfileType && hasPhotos && (
        <div 
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 pr-4 flex-1 scroll-smooth"
        >
          {previews.map((preview, index) => (
            <div
              key={index}
              className="w-24 h-24 rounded-[2rem] overflow-hidden relative border-2 border-white shadow-md flex-shrink-0 animate-in zoom-in duration-300"
            >
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
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