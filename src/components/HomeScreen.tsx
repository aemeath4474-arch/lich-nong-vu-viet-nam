import React, { useState } from 'react';
import { NongVuDatabase, NongVuRecord, ActiveScreen } from '../types.ts';
import { 
  Search, 
  Wheat, 
  Calendar, 
  BookOpen, 
  HelpCircle, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Sun,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Layers,
  Leaf
} from 'lucide-react';

interface HomeScreenProps {
  data: NongVuDatabase;
  setActiveScreen: (screen: ActiveScreen) => void;
  onSelectCrop: (crop: NongVuRecord) => void;
  onAskQuestion: (query: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  data, 
  setActiveScreen, 
  onSelectCrop,
  onAskQuestion 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredCrops = data.danh_sach_nong_vu.filter(crop => {
    const matchesSearch = 
      crop.ten_cay_trong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop.ten_goi_khac && crop.ten_goi_khac.toLowerCase().includes(searchTerm.toLowerCase())) ||
      crop.mua_vu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.khu_vuc_ap_dung.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = 
      selectedRegion === 'all' || 
      crop.khu_vuc_ap_dung.toLowerCase().includes(selectedRegion.toLowerCase());

    return matchesSearch && matchesRegion;
  });

  const popularQuickQueries = [
    "Thời vụ gieo lúa Chiêm Xuân miền Bắc",
    "Cách trừ sâu cuốn lá bằng tro bếp",
    "Thời gian thu hoạch lúa Hè Thu Nam Bộ",
    "Kinh nghiệm bón vôi cho cây đậu phộng"
  ];

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Section with Warm Heritage Agricultural Motif */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl border border-emerald-700/50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/80 border border-emerald-600 text-amber-300 text-xs sm:text-sm font-medium tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Kho Tàng Nông Nghiệp & Văn Hóa Lúa Nước Ngàn Đời</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
            Lịch Nông Vụ & Tri Thức Canh Tác <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
              Truyền Thống Việt Nam
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-emerald-100 font-light leading-relaxed">
            Tra cứu mùa vụ gieo trồng, thời tiết nông vụ, kinh nghiệm sản xuất theo 24 tiết khí và các phương pháp canh tác tự nhiên đúc kết qua nhiều thế hệ cha ông.
          </p>

          {/* Search Box - Big & Accessible for mobile/farmers */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-6 h-6 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm cây trồng (lúa, ngô, khoai...), mùa vụ, vùng miền hoặc mẹo canh tác..."
                className="w-full pl-13 pr-28 py-4 sm:py-4.5 rounded-2xl bg-white text-stone-900 placeholder-stone-400 text-base shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-400/50 font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-24 text-xs text-stone-400 hover:text-stone-600 px-2 py-1"
                >
                  Xóa
                </button>
              )}
              <button
                onClick={() => {
                  if (searchTerm) {
                    onAskQuestion(searchTerm);
                  }
                }}
                className="absolute right-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 font-semibold text-sm transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Hỏi AI</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Query Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-emerald-200">
              <span className="font-medium text-emerald-300">Gợi ý tra cứu:</span>
              {popularQuickQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskQuestion(q)}
                  className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-amber-200 px-3 py-1 rounded-full border border-emerald-600/60 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-emerald-700/60 text-center">
            <div className="bg-emerald-800/50 rounded-xl p-3 border border-emerald-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">
                {data.danh_sach_nong_vu.length}
              </div>
              <div className="text-xs text-emerald-200 mt-0.5">Cây trồng & Mùa vụ</div>
            </div>
            <div className="bg-emerald-800/50 rounded-xl p-3 border border-emerald-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">24</div>
              <div className="text-xs text-emerald-200 mt-0.5">Tiết khí nông vụ</div>
            </div>
            <div className="bg-emerald-800/50 rounded-xl p-3 border border-emerald-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">
                {data.tri_thuc_canh_tac.length}+
              </div>
              <div className="text-xs text-emerald-200 mt-0.5">Tri thức cổ truyền</div>
            </div>
            <div className="bg-emerald-800/50 rounded-xl p-3 border border-emerald-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">
                {data.tai_lieu_tham_khao.length}
              </div>
              <div className="text-xs text-emerald-200 mt-0.5">Nguồn tư liệu đối chiếu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards - 4 Key Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setActiveScreen('calendar')}
          className="group cursor-pointer bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
              Lịch Nông Vụ Chi Tiết
            </h3>
            <p className="text-stone-600 text-sm mt-2 leading-relaxed">
              Khung thời vụ gieo cấy, chăm sóc và thu hoạch chi tiết cho từng loại cây trồng theo tháng và vùng sinh thái Bắc - Trung - Nam.
            </p>
          </div>
          <div className="mt-5 flex items-center text-sm font-semibold text-emerald-700 gap-1 group-hover:translate-x-1 transition-transform">
            <span>Khám phá lịch mùa vụ</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => setActiveScreen('knowledge')}
          className="group cursor-pointer bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
              Tri Thức Canh Tác Cổ Truyền
            </h3>
            <p className="text-stone-600 text-sm mt-2 leading-relaxed">
              Bí quyết làm đất ải, sục bùn, phòng trừ sâu bệnh bằng thảo mộc tự nhiên, điều tiết nước và ca dao tục ngữ kinh nghiệm nhà nông.
            </p>
          </div>
          <div className="mt-5 flex items-center text-sm font-semibold text-amber-800 gap-1 group-hover:translate-x-1 transition-transform">
            <span>Xem tri thức dân gian</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => setActiveScreen('qa')}
          className="group cursor-pointer bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Hỏi Đáp Nông Nghiệp
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                Gemini AI
              </span>
            </div>
            <p className="text-stone-600 text-sm mt-2 leading-relaxed">
              Đặt câu hỏi chuyên sâu về thời vụ và kỹ thuật. Trợ lý Gemini tra cứu đối chiếu chuẩn xác theo tệp dữ liệu nongvu.json.
            </p>
          </div>
          <div className="mt-5 flex items-center text-sm font-semibold text-emerald-700 gap-1 group-hover:translate-x-1 transition-transform">
            <span>Đặt câu hỏi ngay</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Main Crop & Season Directory */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Wheat className="w-6 h-6 text-emerald-700" />
              <span>Cây Trồng & Mùa Vụ Phổ Biến</span>
            </h2>
            <p className="text-stone-600 text-sm mt-0.5">
              Chọn cây trồng để xem trọn vẹn 11 trường thông tin lịch gieo cấy, chăm sóc và kinh nghiệm truyền thống
            </p>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedRegion === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tất cả vùng
            </button>
            <button
              onClick={() => setSelectedRegion('Bắc')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedRegion === 'Bắc'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Miền Bắc
            </button>
            <button
              onClick={() => setSelectedRegion('Trung')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedRegion === 'Trung'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Miền Trung
            </button>
            <button
              onClick={() => setSelectedRegion('Nam')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedRegion === 'Nam'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nam Bộ / ĐBSCL
            </button>
            <button
              onClick={() => setSelectedRegion('Tây Nguyên')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedRegion === 'Tây Nguyên'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tây Nguyên
            </button>
          </div>
        </div>

        {/* Crops Grid */}
        {filteredCrops.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-stone-300">
            <Wheat className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">Không tìm thấy cây trồng phù hợp</h3>
            <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
              Không có dữ liệu trùng khớp với từ khóa "{searchTerm}". Bạn có thể thử tìm với tên thông thường hoặc kiểm tra tệp nongvu.json.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedRegion('all'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id || crop.ten_cay_trong}
                onClick={() => onSelectCrop(crop)}
                className="group cursor-pointer bg-white rounded-2xl border border-stone-200 p-5 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 group-hover:scale-125 transition-transform" />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {crop.nhom_cay || 'Cây trồng'}
                    </span>
                    <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {crop.mua_vu.split('(')[0].trim()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors font-serif">
                      {crop.ten_cay_trong}
                    </h3>
                    {crop.ten_goi_khac && (
                      <p className="text-xs text-stone-500 italic mt-0.5">
                        {crop.ten_goi_khac}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate font-medium">{crop.khu_vuc_ap_dung}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2"><strong>Gieo trồng:</strong> {crop.thoi_gian_gieo_trong}</span>
                    </div>
                  </div>

                  {crop.kinh_nghiem_dan_gian && (
                    <div className="bg-amber-50/70 border-l-2 border-amber-500 p-2 text-[11px] text-amber-900 italic font-serif line-clamp-2">
                      {crop.kinh_nghiem_dan_gian}
                    </div>
                  )}
                </div>

                <div className="relative z-10 pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400">Xem đủ 11 trường chi tiết</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveScreen('calendar')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-sm shadow-sm transition-colors"
          >
            <span>Xem toàn bộ Lịch Nông Vụ 12 Tháng & Ma trận mùa vụ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 24 Tiết Khí Nông Vụ Preview Banner */}
      <section className="bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <Sun className="w-4 h-4" />
              <span>Thiên văn học nông nghiệp cổ truyền</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
              Hệ Thống 24 Tiết Khí Nông Nghiệp Việt Nam
            </h3>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              Cổ nhân chia 1 năm thành 24 tiết khí, mỗi tiết khí tương ứng với một hiện tượng thời tiết đặc thù chỉ dẫn cho hành vi canh tác gieo cấy.
            </p>
          </div>
          <button
            onClick={() => setActiveScreen('knowledge')}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:border-amber-500 text-stone-800 text-xs font-semibold hover:text-amber-800 transition-colors shadow-xs"
          >
            Xem kho kinh nghiệm canh tác
          </button>
        </div>

        {/* Scrollable / Grid of key solar terms */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {data.tiet_khi_24.slice(0, 6).map((tiet) => (
            <div key={tiet.ten} className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="font-bold text-emerald-800 text-sm">{tiet.ten}</div>
                <div className="text-[11px] text-amber-700 font-medium mt-0.5">{tiet.thoi_gian}</div>
                <p className="text-stone-600 text-xs mt-2 line-clamp-3">
                  {tiet.y_nghia_nong_vu}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
