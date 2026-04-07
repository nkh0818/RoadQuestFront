import React, { useEffect, useState } from "react";
import { ArrowLeft, UserX, Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import SubHeader from "../components/common/SubHeader";
import FadeIn from "../components/common/FadeIn";

export default function BlockedUser() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 차단 목록 가져오기
  const fetchBlockedUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/api/blocks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlockedUsers(res.data);
    } catch (err) {
      console.error("차단 목록 로드 실패", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  // 2. 차단 해제 함수
  const handleUnblock = async (userId, nickname) => {
    if (!window.confirm(`${nickname}님을 차단 해제하시겠습니까?`)) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`/api/blocks/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 목록에서 즉시 제거 (UX)
      setBlockedUsers((prev) => prev.filter((user) => user.userId !== userId));
      alert("차단이 해제되었습니다.");
    } catch (err) {
      console.log(err);
      alert("해제에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SubHeader title="차단목록" />

      <main className="px-6 mt-6 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-bold">
            차단한 유저가 없습니다. 🕊️
          </div>
        ) : (
          blockedUsers.map((user, idx) => (
            <FadeIn key={user.userId} delay={idx * 50}>
              <div className="bg-white p-5 rounded-[2rem] flex items-center justify-between shadow-sm border border-transparent hover:border-rose-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                    <UserX size={22} />
                  </div>
                  <div>
                    <span className="block font-bold text-[16px] text-slate-700">
                      {user.nickname}
                    </span>
                    <span className="text-[12px] text-slate-400 font-medium">
                      차단일: {user.createdAt?.split("T")[0]}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleUnblock(user.userId, user.nickname)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl text-[13px] font-black transition-all active:scale-95 flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  해제
                </button>
              </div>
            </FadeIn>
          ))
        )}
      </main>
    </div>
  );
}
