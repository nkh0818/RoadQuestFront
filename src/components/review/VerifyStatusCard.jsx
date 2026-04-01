import { MapPin, ShieldCheck, Loader2 } from "lucide-react";

{/* GPS 인증 상태 배너 UI */}

export default function VerifyStatusCard({ status }) {
  const isVerified = status === "verified";
  const isLoading = status === "loading";

  return (
    <section className={`p-5 rounded-[2rem] border-2 transition-all duration-500 flex items-center justify-between ${
      isVerified ? "bg-blue-50 border-blue-100" : "bg-white border-slate-100 shadow-sm"
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
          isVerified ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
        }`}>
          {isLoading && <Loader2 strokeWidth={2.5} className="animate-spin" />}
          {isVerified && <ShieldCheck size={26} strokeWidth={2.5} />}
          {status === "normal" && <MapPin size={24} strokeWidth={2.5} />}
        </div>
        <div>
          <h3 className="text-[15px] font-black text-slate-900 leading-tight">
            {isLoading ? "위치 확인 중..." : isVerified ? "현장 방문 인증됨" : "일반 리뷰 모드"}
          </h3>
          <p className="text-[12px] font-bold text-slate-400 mt-0.5">
            {isVerified
              ? "포인트와 XP가 더 많이 적립됩니다!"
              : "현장 근처에서만 인증이 가능해요."}
          </p>
        </div>
      </div>
    </section>
  );
}
