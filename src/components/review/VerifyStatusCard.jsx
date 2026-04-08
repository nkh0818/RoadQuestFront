import { MapPin, ShieldCheck, Loader2, Search, ChevronRight, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  idle: {
    bg: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-200 text-blue-500",
    Icon: Search,
    title: "휴게소를 선택해주세요",
    desc: "리뷰를 작성할 휴게소를 먼저 선택해야 해요.",
  },
  noLocation: {
    bg: "bg-slate-50 border-slate-200",
    iconBg: "bg-slate-200 text-slate-500",
    Icon: AlertCircle,
    title: "위치 인증 미지원",
    desc: "이 휴게소는 현재 위치 인증을 지원하지 않아요.",
  },
  loading: {
    bg: "bg-white border-blue-100 shadow-sm",
    iconBg: "bg-blue-50 text-blue-400",
    Icon: Loader2,
    title: "위치 확인 중...",
    desc: "GPS로 현장 방문 여부를 확인하고 있어요.",
  },
  verified: {
    bg: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-600 text-white",
    Icon: ShieldCheck,
    title: "현장 방문 인증됨",
    desc: "포인트와 XP가 더 많이 적립됩니다!",
  },
  normal: {
    bg: "bg-white border-slate-100 shadow-sm",
    iconBg: "bg-slate-100 text-slate-400",
    Icon: MapPin,
    title: "일반 리뷰 모드",
    desc: "현장 근처에서만 인증이 가능해요.",
  },
};

export default function VerifyStatusCard({ status, restAreaName, onSelectRequest, isEdit, hasLocationData }) {
  let currentStatus = status;
  
  if (restAreaName && status === "idle") {
    currentStatus = hasLocationData === false ? "noLocation" : "loading";
  }

  const config = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.normal;
  const { Icon } = config;

  return (
    <section
      className={`p-5 rounded-4xl border-2 transition-all duration-500 ${config.bg}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${config.iconBg}`}
          >
            <Icon
              size={24}
              strokeWidth={2.5}
              className={currentStatus === "loading" ? "animate-spin" : ""}
            />
          </div>

          <div className="min-w-0">
            {restAreaName && (
              <p className="text-[13px] font-black text-blue-600 truncate leading-tight mb-0.5">
                {restAreaName}
              </p>
            )}
            
            <h3 className="text-[15px] font-black text-slate-900 leading-tight">
              {restAreaName && currentStatus === "loading" ? "위치 정보를 가져오는 중..." : config.title}
            </h3>
            
            <p className="text-[12px] font-bold text-slate-400 mt-1">
              {config.desc}
            </p>
          </div>
        </div>

        {!isEdit && (
          <button
            type="button"
            onClick={onSelectRequest}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-black transition-all active:scale-95 ${
              !restAreaName
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {restAreaName ? "변경" : "선택"}
            <ChevronRight size={14} strokeWidth={3} />
          </button>
        )}
      </div>
    </section>
  );
}