import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Search, MessageSquare, User, Sparkle } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export default function FooterNavbar() {

  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const isLoggedIn = user !== null;

  const [showLoginTooltip, setShowLoginTooltip] = useState(false);
  const tooltipRef = useRef(null);

  // 외부 클릭 시 툴팁 닫기
  useEffect(() => {
    if (!showLoginTooltip) return;
    const handleOutsideClick = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setShowLoginTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showLoginTooltip]);

  const navItems = [
    { icon: Home, label: '홈', path: '/' },
    { icon: MessageSquare, label: '커뮤니티', path: '/community' },
    { icon: Sparkle, label: 'AI추천', path: 'ai-guide' },
    { icon: User, label: '프로필', path: '/my' },
  ];

  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-white border-t border-gray-100 px-8 py-3 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        // PROFILE 탭: 비로그인 상태일 때 툴팁 표시
        if (item.label === 'PROFILE' && !isLoggedIn) {
          return (
            <div
              key={item.path}
              ref={tooltipRef}
              className="relative"
            >
              {/* 로그인 필요 툴팁 */}
              {showLoginTooltip && (
                <section
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-200 rounded-[1.5rem] shadow-lg p-4 flex flex-col items-center gap-3"
                >
                  <p className="text-xs font-bold text-gray-600 text-center leading-relaxed">
                    로그인이 필요한 기능이에요!
                  </p>
                  <Link
                    to="/login"
                    onClick={() => setShowLoginTooltip(false)}
                    className="w-full text-center text-xs font-black text-white bg-[#3182CE] rounded-xl py-2 transition-all active:scale-95 hover:bg-[#2563EB]"
                  >
                    로그인하기
                  </Link>
                </section>
              )}

              {/* 아이콘 버튼 */}
              <div
                className="flex flex-col items-center gap-1 min-w-16 cursor-pointer text-gray-300 hover:text-gray-400 transition-all active:scale-90"
                onClick={() => setShowLoginTooltip((prev) => !prev)}
              >
                <item.icon className="w-6 h-6" strokeWidth={2} />
                <span className="text-[9px] font-black tracking-tight uppercase">
                  {item.label}
                </span>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-all active:scale-90 ${
              isActive ? 'text-[#3182CE]' : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-black tracking-tight uppercase">
              {item.label}
            </span>
          </Link>
        );
      })}
    </footer>
  );
}