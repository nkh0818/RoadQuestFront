import { Gift, ShieldCheck } from "lucide-react";

{/* ReviewForm - ReWardModal
    작성 완료 시 보상 결과를 띄우는 모달입니다.
  */}

export default function RewardModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 font-['Pretendard']">
      <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-xs text-center shadow-2xl animate-in zoom-in-95 duration-300">
        <div className={`w-24 h-24 mx-auto mb-6 rounded-[2rem] flex items-center justify-center shadow-lg ${
          data.isVerified ? "bg-blue-600 shadow-blue-200" : "bg-slate-800"
        }`}>
          {data.isVerified
            ? <ShieldCheck size={40} strokeWidth={2.5} className="text-white" />
            : <Gift size={40} strokeWidth={2.5} className="text-white" />}
        </div>
        <h3 className="text-[22px] font-black text-slate-900 mb-2">
          {data.isVerified ? "현장 인증 완료!" : "리뷰 기록 완료!"}
        </h3>
        <p className="text-[14px] font-bold text-slate-400 leading-relaxed mb-8">
          소중한 경험을 공유해주셔서 감사해요.<br />
          <span className="text-blue-600 font-black">+{data.points}P / +{data.xp}XP</span>가 적립되었습니다!
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95"
        >
          커뮤니티로 돌아가기
        </button>
      </div>
    </div>
  );
}
