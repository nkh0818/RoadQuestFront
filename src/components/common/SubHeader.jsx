// SubHeader.jsx
import React from 'react';
import BackButton from './Backbutton';

const SubHeader = ({ title, showBack = true, rightElement, children }) => {
  return (
    <header className="px-5 py-3 flex items-center gap-3 bg-white z-30 shrink-0 border-b border-gray-50 min-h-[64px]">
      {/* 왼쪽: 뒤로가기 */}
      {showBack && <BackButton />}

      {/* 가운데: children */}
      <div className="flex-1 flex items-center justify-center h-full">
        {title ? (
          <h2 className="text-[18px] font-black text-slate-900 tracking-tighter leading-none">
            {title}
          </h2>
        ) : (
          children
        )}
      </div>

      {/* 오른쪽: 추가 버튼 */}
      {rightElement && (
        <div className="flex items-center justify-end z-10">
          {rightElement}
        </div>
      )}
    </header>
  );
};

export default SubHeader;