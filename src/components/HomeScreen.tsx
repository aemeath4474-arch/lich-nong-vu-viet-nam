import React, { useState } from 'react';
import { NongVuDatabase, NongVuRecord, ActiveScreen, TriThuc } from '../types.ts';
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
  ChevronRight,
  Filter,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  GraduationCap,
  Sprout,
  X,
  BookMarked
} from 'lucide-react';
import { buildSourceCitation, hasSource, isRegionOrTimeUnspecified } from '../utils/sourceUtils.ts';

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
  
  // Requirement 3: Multi-filters on Homepage (Geographic region, crop type, and season)
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCropType, setSelectedCropType] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  // Citation copy toast state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const regionOptions = [
    { id: 'all', label: 'Tất cả khu vực' },
    { id: 'Bắc', label: 'Miền Bắc (ĐB Sông Hồng & Trung du)' },
    { id: 'Trung', label: 'Miền Trung (Bắc Trung Bộ & Duyên hải)' },
    { id: 'Nam', label: 'Miền Nam (ĐBSCL & Đông Nam Bộ)' },
    { id: 'Tây Nguyên', label: 'Tây Nguyên' },
  ];

  const seasonOptions = [
    { id: 'all', label: 'Tất cả mùa vụ' },
    { id: 'Chiêm Xuân', label: 'Vụ Chiêm Xuân (Đông Xuân)' },
    { id: 'Hè Thu', label: 'Vụ Hè Thu' },
    { id: 'Mùa', label: 'Vụ Mùa' },
    { id: 'Đông', label: 'Vụ Đông / Thu Đông' },
    { id: 'lâu năm', label: 'Cây lâu năm' },
  ];

  // Requirement 7: Search across crop name, other name, locality, and farming knowledge content
  const qClean = searchTerm.trim().toLowerCase();

  const filteredCrops = data.danh_sach_nong_vu.filter(crop => {
    // Matching search term
    const matchesSearch = !qClean || 
      crop.ten_cay_trong.toLowerCase().includes(qClean) ||
      (crop.ten_goi_khac && crop.ten_goi_khac.toLowerCase().includes(qClean)) ||
      crop.khu_vuc_ap_dung.toLowerCase().includes(qClean) ||
      crop.dieu_kien_canh_tac.toLowerCase().includes(qClean) ||
      crop.phuong_phap_canh_tac_truyen_thong.toLowerCase().includes(qClean) ||
      crop.kinh_nghiem_dan_gian.toLowerCase().includes(qClean);

    // Matching Geographic Region filter
    const matchesRegion = 
      selectedRegion === 'all' || 
      crop.khu_vuc_ap_dung.toLowerCase().includes(selectedRegion.toLowerCase());

    // Matching Crop Type filter
    const matchesCropType = 
      selectedCropType === 'all' || 
      (crop.nhom_cay && crop.nhom_cay.toLowerCase() === selectedCropType.toLowerCase());

    // Matching Season filter
    const matchesSeason = 
      selectedSeason === 'all' || 
      crop.mua_vu.toLowerCase().includes(selectedSeason.toLowerCase());

    return matchesSearch && matchesRegion && matchesCropType && matchesSeason;
  });

  // Also search knowledge content if user searched a term
  const matchedKnowledge: TriThuc[] = qClean
    ? data.tri_thuc_canh_tac.filter(k => 
        k.chu_de.toLowerCase().includes(qClean) ||
        k.chi_tiet.toLowerCase().includes(qClean) ||
        k.ca_dao_tuc_ngu.toLowerCase().includes(qClean) ||
        k.phan_loai.toLowerCase().includes(qClean)
      )
    : [];

  const handleCopyCitation = (e: React.MouseEvent, item: NongVuRecord | TriThuc, id: string) => {
    e.stopPropagation();
    if (!hasSource(item)) {
      setToastMessage('Bản ghi này chưa có nguồn tư liệu để trích dẫn.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const citation = buildSourceCitation(item);
    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    setToastMessage(`Đã sao chép trích dẫn: "${item.nguon_tu_lieu.slice(0, 35)}..."`);
    setTimeout(() => {
      setCopiedId(null);
      setToastMessage(null);
    }, 2500);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('all');
    setSelectedCropType('all');
    setSelectedSeason('all');
  };

  const popularQuickQueries = [
    "Lúa Chiêm Xuân miền Bắc",
    "Trừ rầy bằng tro bếp",
    "Lạc đậu phộng Bắc Trung Bộ",
    "Lúa nổi Đồng bằng Sông Cửu Long",
    "Cà phê Robusta Tây Nguyên"
  ];

  const hasActiveFilters = selectedRegion !== 'all' || selectedCropType !== 'all' || selectedSeason !== 'all' || searchTerm;

  return (
    <div className="space-y-10 pb-12">
      
      {/* Toast Feedback for Copy Citation */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-stone-700 flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl border border-emerald-700/50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/80 border border-emerald-600 text-amber-300 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Kho Tàng Lịch Nông Vụ & Tri Thức Canh Tác Việt Nam</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
            Tra Cứu Lịch Nông Vụ & Mùa Vụ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
              Chính Xác Theo Từng Vùng Miền
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-emerald-100 font-light leading-relaxed">
            Tra cứu thời điểm gieo cấy, chăm sóc, thu hoạch, đối chiếu tri thức dân gian và công bố nguồn tư liệu chính xác, trung thực.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-6 h-6 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên cây, tên khác, địa phương, kỹ thuật làm đất, trừ sâu..."
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

            {/* Quick Query Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-emerald-200">
              <span className="font-medium text-emerald-300">Gợi ý nhanh:</span>
              {popularQuickQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchTerm(q)}
                  className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-amber-200 px-3 py-1 rounded-full border border-emerald-600/60 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-emerald-700/60 text-center">
            <div className="bg-emerald-800/50 rounded-xl p-3 border border-emerald-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">
                {data.danh_sach_nong_vu.length}
              </div>
              <div className="text-xs text-emerald-200 mt-0.5">Bản ghi mùa vụ</div>
            </div>
            <div className="bg-emerald-800/50 rounded-xl p-3 border border-emerald-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">24</div>
              <div className="text-xs text-emerald-200 mt-0.5">Tiết khí nông vụ</div>
            </div>
            <div className="bg-emerald-800/50 rounded-xl p-3 border border-emerald-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">
                {data.tri_thuc_canh_tac.length}
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

      {/* REQUIREMENT 3: MULTI-FILTER TOOLBAR AT HOMEPAGE */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-stone-800 font-bold text-base font-serif">
            <Filter className="w-5 h-5 text-emerald-700" />
            <span>Bộ Lọc Kết Hợp: Vùng Miền, Loại Cây & Mùa Vụ</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 self-start md:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* 1. Geographic Region Filter */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>1. Khu vực địa lý:</span>
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {regionOptions.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* 2. Crop Type Filter */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5 text-emerald-700" />
              <span>2. Loại cây trồng:</span>
            </label>
            <select
              value={selectedCropType}
              onChange={(e) => setSelectedCropType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">Tất cả loại cây</option>
              {data.nhom_cay_trong.map((g) => (
                <option key={g.id} value={g.ten}>{g.ten}</option>
              ))}
            </select>
          </div>

          {/* 3. Season Filter */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>3. Mùa vụ canh tác:</span>
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium text-stone-800 outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {seasonOptions.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter status summary */}
        <div className="text-[11px] text-stone-500 pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
          <span>
            Tìm thấy <strong>{filteredCrops.length}</strong> cây trồng phù hợp
            {qClean && <span> cho từ khóa "<em>{searchTerm}</em>"</span>}
          </span>
          <span className="text-emerald-800 font-medium">
            Cho phép kết hợp đồng thời cả 3 tiêu chí lọc và ô tìm kiếm
          </span>
        </div>
      </section>

      {/* REQUIREMENT 7: MATCHED KNOWLEDGE RESULTS FROM NONVU.JSON */}
      {matchedKnowledge.length > 0 && (
        <section className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-800" />
            <h3 className="text-lg font-serif font-bold text-amber-950">
              Tri Thức Canh Tác Trùng Khớp Từ Khóa ({matchedKnowledge.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedKnowledge.map((k) => (
              <div key={k.id} className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-800 px-2 py-0.5 rounded-md bg-amber-100">
                    {k.phan_loai}
                  </span>
                  
                  {/* Requirement 2: Orange warning if source missing */}
                  {!hasSource(k) ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-amber-950">
                      Chưa có nguồn tư liệu
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleCopyCitation(e, k, k.id)}
                      className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200"
                      title="Sao chép trích dẫn nguồn"
                    >
                      {copiedId === k.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === k.id ? 'Đã chép' : 'Chép nguồn'}</span>
                    </button>
                  )}
                </div>

                <h4 className="font-bold text-stone-900 text-sm font-serif">{k.chu_de}</h4>
                <p className="text-xs text-stone-600 line-clamp-2">{k.chi_tiet}</p>

                {/* Requirement 7: Display source of knowledge */}
                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center gap-1">
                  <BookMarked className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">Nguồn: {k.nguon_tu_lieu || 'Chưa ghi nhận'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Crop & Season Directory */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Wheat className="w-6 h-6 text-emerald-700" />
              <span>Danh Sách Cây Trồng & Lịch Nông Vụ</span>
            </h2>
            <p className="text-stone-600 text-sm mt-0.5">
              Bản ghi đầy đủ 11 trường thông tin kèm trích dẫn nguồn tư liệu chính thức
            </p>
          </div>
        </div>

        {/* Crops Grid */}
        {filteredCrops.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-stone-300 space-y-3">
            <Wheat className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">Không tìm thấy cây trồng phù hợp</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Không có dữ liệu trùng khớp với các bộ lọc đã chọn. Hãy thử điều chỉnh khu vực hoặc đặt lại bộ lọc.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-xl shadow-xs hover:bg-emerald-900 transition-colors"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCrops.map((crop) => {
              const cropHasSrc = hasSource(crop);
              const isUnspecified = isRegionOrTimeUnspecified(crop);

              return (
                <div
                  key={crop.id || crop.ten_cay_trong}
                  onClick={() => onSelectCrop(crop)}
                  className="group cursor-pointer bg-white rounded-3xl border border-stone-200 p-5 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {crop.nhom_cay || 'Cây trồng'}
                      </span>

                      {/* Requirement 8: Modern vs Traditional vs Unclassified */}
                      {crop.loai_thong_tin === 'truyen_thong' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900 text-amber-300 flex items-center gap-1">
                          <Sprout className="w-3 h-3" />
                          <span>Tri thức cổ truyền</span>
                        </span>
                      )}
                      {crop.loai_thong_tin === 'hien_dai' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-900 text-sky-200 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          <span>Kỹ thuật hiện đại</span>
                        </span>
                      )}
                    </div>

                    {/* Requirement 2: Orange warning badge if source is missing */}
                    {!cropHasSrc && (
                      <div className="bg-amber-500 text-amber-950 font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-amber-600">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Chưa có nguồn tư liệu</span>
                      </div>
                    )}

                    {/* Requirement 9: Warning banner if region or time unspecified */}
                    {isUnspecified && (
                      <div className="bg-rose-50 border border-rose-300 text-rose-900 text-[11px] p-2 rounded-xl flex items-start gap-1.5 leading-tight">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Chưa xác định rõ khu vực hoặc thời gian áp dụng</span>
                      </div>
                    )}

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
                        <span className="truncate font-medium">{crop.khu_vuc_ap_dung || 'Chưa xác định'}</span>
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

                    {/* Source citation row with Requirement 4: Copy Citation button */}
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-700 flex items-center gap-1">
                          <BookMarked className="w-3 h-3 text-stone-400" />
                          <span>Nguồn:</span>
                        </span>
                        {cropHasSrc && (
                          <button
                            onClick={(e) => handleCopyCitation(e, crop, crop.id || crop.ten_cay_trong)}
                            className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 transition-colors"
                            title="Sao chép trích dẫn nguồn"
                          >
                            {copiedId === (crop.id || crop.ten_cay_trong) ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === (crop.id || crop.ten_cay_trong) ? 'Đã chép' : 'Sao chép nguồn'}</span>
                          </button>
                        )}
                      </div>
                      <p className="line-clamp-2 text-stone-800">
                        {crop.nguon_tu_lieu || <span className="text-amber-800 italic font-semibold">Chưa có nguồn tư liệu</span>}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-400">Xem 11 trường chi tiết</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
