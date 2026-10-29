import React from 'react';
import { ActiveScreen } from '../types.ts';
import { 
  Sprout, 
  Calendar, 
  BookOpen, 
  HelpCircle, 
  Library, 
  Info,
  Menu,
  X,
  Wheat
} from 'lucide-react';

interface HeaderProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeScreen, setActiveScreen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: ActiveScreen; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Trang chủ', icon: <Sprout className="w-5 h-5" /> },
    { id: 'calendar', label: 'Lịch Nông Vụ', icon: <Calendar className="w-5 h-5" /> },
    { id: 'knowledge', label: 'Tri Thức Canh Tác', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'qa', label: 'Hỏi Đáp Nông Nghiệp', icon: <HelpCircle className="w-5 h-5" />, badge: 'Gemini AI' },
    { id: 'sources', label: 'Nguồn Tư Liệu', icon: <Library className="w-5 h-5" /> },
    { id: 'about', label: 'Giới Thiệu', icon: <Info className="w-5 h-5" /> },
  ];

  const handleNavClick = (id: ActiveScreen) => {
    setActiveScreen(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      {/* Top Banner Accent */}
      <div className="bg-amber-600 text-amber-50 text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Wheat className="w-3.5 h-3.5 text-amber-200" />
        <span>Di sản Văn hóa Nông nghiệp Lúa nước Việt Nam & Tri thức Canh tác Cổ truyền</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Title */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 shadow-md group-hover:scale-105 transition-transform">
              <Wheat className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-xl text-white font-serif">
                  LỊCH NÔNG VỤ VIỆT NAM
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                Tri thức canh tác truyền thống & Thời vụ gieo trồng bản địa
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                    isActive
                      ? 'bg-emerald-800 text-amber-300 shadow-inner'
                      : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/90 text-amber-950 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none"
              aria-label="Mở bảng điều hướng"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950/95 border-b border-emerald-800 px-4 pt-2 pb-4 space-y-1 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-amber-300 font-semibold'
                    : 'text-emerald-100 hover:bg-emerald-900/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500 text-amber-950 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
