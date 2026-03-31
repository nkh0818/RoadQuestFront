export default function ReviewTextArea({ value, onChange }) {
  return (
    <section className="space-y-4">
      <label className="text-[14px] font-black text-slate-900 flex items-center gap-1.5 px-1">
        <div className="w-1 h-3.5 bg-blue-600 rounded-full" /> 상세 리뷰
      </label>
      <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 focus-within:border-blue-200 transition-all">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-40 border-none focus:ring-0 text-[16px] font-medium p-0 bg-transparent text-slate-700 placeholder:text-slate-300 leading-relaxed resize-none font-['Pretendard']"
          placeholder="어떤 점이 좋았나요? 맛이나 시설 등 자유롭게 기록해 보세요."
        />
      </div>
    </section>
  );
}
