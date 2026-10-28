import React, { useState, useEffect } from 'react';
import { ActiveScreen, NongVuDatabase, NongVuRecord } from './types.ts';
import { defaultNongVuData } from './data/defaultData.ts';
import { Header } from './components/Header.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { CalendarScreen } from './components/CalendarScreen.tsx';
import { KnowledgeScreen } from './components/KnowledgeScreen.tsx';
import { QAScreen } from './components/QAScreen.tsx';
import { SourcesScreen } from './components/SourcesScreen.tsx';
import { AboutScreen } from './components/AboutScreen.tsx';
import { CropDetailModal } from './components/CropDetailModal.tsx';
import { 
  Sprout, 
  Calendar, 
  BookOpen, 
  HelpCircle, 
  Library, 
  Info,
  Wheat,
  Heart
} from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [data, setData] = useState<NongVuDatabase>(defaultNongVuData);
  const [selectedCrop, setSelectedCrop] = useState<NongVuRecord | null>(null);
  const [qaInitialQuestion, setQaInitialQuestion] = useState<string>('');

  // Fetch latest nongvu data from server on startup
  useEffect(() => {
    fetch('/api/nongvu')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Dùng dữ liệu tích hợp mặc định');
      })
      .then((serverData) => {
        if (serverData && serverData.danh_sach_nong_vu) {
          setData(serverData);
        }
      })
      .catch((err) => {
        console.log('Using default bundled data:', err.message);
      });
  }, []);

  const handleSelectCrop = (crop: NongVuRecord) => {
    setSelectedCrop(crop);
  };

  const handleAskQuestion = (query: string) => {
    setQaInitialQuestion(query);
    setActiveScreen('qa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordAdded = (newRecord: NongVuRecord) => {
    setData((prev) => ({
      ...prev,
      danh_sach_nong_vu: [newRecord, ...prev.danh_sach_nong_vu],
    }));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col selection:bg-amber-300 selection:text-emerald-950 pb-16 lg:pb-0">
      
      {/* Sticky Header with Brand and Navigation */}
      <Header activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeScreen === 'home' && (
          <HomeScreen
            data={data}
            setActiveScreen={setActiveScreen}
            onSelectCrop={handleSelectCrop}
            onAskQuestion={handleAskQuestion}
          />
        )}

        {activeScreen === 'calendar' && (
          <CalendarScreen
            data={data}
            onSelectCrop={handleSelectCrop}
            onAskQuestion={handleAskQuestion}
          />
        )}

        {activeScreen === 'knowledge' && (
          <KnowledgeScreen
            data={data}
            onAskQuestion={handleAskQuestion}
          />
        )}

        {activeScreen === 'qa' && (
          <QAScreen
            initialQuestion={qaInitialQuestion}
            onClearInitialQuestion={() => setQaInitialQuestion('')}
          />
        )}

        {activeScreen === 'sources' && (
          <SourcesScreen
            data={data}
            onRecordAdded={handleRecordAdded}
          />
        )}

        {activeScreen === 'about' && (
          <AboutScreen />
        )}
      </main>

      {/* Crop Detail Modal (11 fields view) */}
      <CropDetailModal
        crop={selectedCrop}
        onClose={() => setSelectedCrop(null)}
        onAskAboutCrop={(cropName) => handleAskQuestion(`Hỏi về kỹ thuật gieo trồng và chăm sóc cây: ${cropName}`)}
      />

      {/* Bottom Navigation for Mobile Quick Access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1 shadow-lg flex items-center justify-around">
        <button
          onClick={() => { setActiveScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeScreen === 'home' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span>Trang chủ</span>
        </button>

        <button
          onClick={() => { setActiveScreen('calendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeScreen === 'calendar' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Lịch vụ</span>
        </button>

        <button
          onClick={() => { setActiveScreen('knowledge'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeScreen === 'knowledge' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Tri thức</span>
        </button>

        <button
          onClick={() => { setActiveScreen('qa'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeScreen === 'qa' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <div className="relative">
            <HelpCircle className="w-5 h-5 mb-0.5 text-amber-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
          </div>
          <span>Hỏi AI</span>
        </button>

        <button
          onClick={() => { setActiveScreen('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium ${
            activeScreen === 'about' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Info className="w-5 h-5 mb-0.5" />
          <span>Giới thiệu</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 mt-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950">
                <Wheat className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-white">
                  LỊCH NÔNG VỤ & TRI THỨC CANH TÁC VIỆT NAM
                </h4>
                <p className="text-xs text-stone-400">
                  Dự án phi lợi nhuận lưu giữ và lan tỏa tinh hoa văn hóa nông nghiệp truyền thống
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button onClick={() => { setActiveScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300">Trang chủ</button>
              <span className="text-stone-600">•</span>
              <button onClick={() => { setActiveScreen('calendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300">Lịch nông vụ</button>
              <span className="text-stone-600">•</span>
              <button onClick={() => { setActiveScreen('knowledge'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300">Tri thức canh tác</button>
              <span className="text-stone-600">•</span>
              <button onClick={() => { setActiveScreen('qa'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300">Hỏi đáp Gemini</button>
              <span className="text-stone-600">•</span>
              <button onClick={() => { setActiveScreen('sources'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300">Nguồn tư liệu</button>
              <span className="text-stone-600">•</span>
              <button onClick={() => { setActiveScreen('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300">Giới thiệu</button>
            </div>
          </div>

          {/* Project & Mandatory Internship Attribution */}
          <div className="bg-stone-800/80 rounded-2xl p-4 sm:p-5 border border-stone-700/80 text-xs sm:text-sm text-stone-300 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Heart className="w-4 h-4 fill-current text-rose-500" />
              <span>Dự án Xã hội Phi lợi nhuận & Sản phẩm Thực tập:</span>
            </div>
            <p className="font-serif italic text-white text-sm sm:text-base leading-relaxed">
              "Sản phẩm thực tập của Nguyễn Văn An, mã sinh viên PH70154, mã dự án E02, Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận."
            </p>
            <p className="text-stone-400 text-xs pt-1">
              Khuyến cáo: Thời vụ gieo trồng có sự biến thiên theo tiểu khí hậu từng địa phương. Dữ liệu đối chiếu từ các nguồn tư liệu nông nghiệp chính thống của Việt Nam.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 pt-2 gap-2">
            <span>© 2026 Lịch Nông Vụ Việt Nam. Toàn bộ nội dung sử dụng bảng mã UTF-8 tiếng Việt có dấu.</span>
            <span>Phiên bản v1.2.0 • Hoàn toàn phi lợi nhuận</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
