import React, { useState } from 'react';
import { NongVuDatabase, NongVuRecord } from '../types.ts';
import { 
  Calendar, 
  MapPin, 
  Filter, 
  Sprout, 
  Clock, 
  Scissors, 
  AlertTriangle, 
  Search, 
  Layers, 
  Grid, 
  ListFilter,
  CheckCircle2,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  GraduationCap,
  BookMarked,
  Info
} from 'lucide-react';
import { buildSourceCitation, hasSource, isRegionOrTimeUnspecified } from '../utils/sourceUtils.ts';

interface CalendarScreenProps {
  data: NongVuDatabase;
  onSelectCrop: (crop: NongVuRecord) => void;
  onAskQuestion: (query: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ 
  data, 
  onSelectCrop,
  onAskQuestion 
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Requirement 6: Monthly view mode
  const [viewMode, setViewMode] = useState<'month_detail' | 'cards' | 'timeline' | 'seasons'>('month_detail');
  const [selectedMonth, setSelectedMonth] = useState<number>(3); // Default to month 3

  // Citation copy toast state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const regions = [
    { id: 'all', label: 'Toàn quốc' },
    { id: 'Bắc', label: 'Miền Bắc (ĐB Sông Hồng & Trung du)' },
    { id: 'Trung', label: 'Bắc Trung Bộ & Duyên hải Nam Trung Bộ' },
    { id: 'Nam', label: 'Đồng bằng Sông Cửu Long (Nam Bộ)' },
    { id: 'Tây Nguyên', label: 'Tây Nguyên' },
  ];

  const seasons = [
    { id: 'all', label: 'Tất cả mùa vụ' },
    { id: 'Chiêm Xuân', label: 'Vụ Chiêm Xuân (Đông Xuân)' },
    { id: 'Hè Thu', label: 'Vụ Hè Thu' },
    { id: 'Vụ Mùa', label: 'Vụ Mùa' },
    { id: 'Vụ Đông', label: 'Vụ Đông / Thu Đông' },
    { id: 'lâu năm', label: 'Cây lâu năm' },
  ];

  const months = [
    { num: 1, name: 'Tháng 1', solar: 'Tháng Giêng', alias: ['tháng 1', 'tháng giêng', 'tiết lập xuân', 'tiết vũ thủy'] },
    { num: 2, name: 'Tháng 2', solar: 'Tháng Hai', alias: ['tháng 2', 'tháng hai', 'kinh trập', 'xuân phân'] },
    { num: 3, name: 'Tháng 3', solar: 'Tháng Ba', alias: ['tháng 3', 'tháng ba', 'thanh minh', 'cốc vũ'] },
    { num: 4, name: 'Tháng 4', solar: 'Tháng Tư', alias: ['tháng 4', 'tháng tư', 'lập hạ'] },
    { num: 5, name: 'Tháng 5', solar: 'Tháng Năm', alias: ['tháng 5', 'tháng năm', 'tiểu mãn', 'mang chủng'] },
    { num: 6, name: 'Tháng 6', solar: 'Tháng Sáu', alias: ['tháng 6', 'tháng sáu', 'hạ chí', 'tiểu thử'] },
    { num: 7, name: 'Tháng 7', solar: 'Tháng Bảy', alias: ['tháng 7', 'tháng bảy', 'đại thử', 'lập thu'] },
    { num: 8, name: 'Tháng 8', solar: 'Tháng Tám', alias: ['tháng 8', 'tháng tám', 'xử thử', 'bạch lộ'] },
    { num: 9, name: 'Tháng 9', solar: 'Tháng Chín', alias: ['tháng 9', 'tháng chín', 'thu phân', 'hàn lộ'] },
    { num: 10, name: 'Tháng 10', solar: 'Tháng Mười', alias: ['tháng 10', 'tháng mười', 'sương giáng', 'lập đông'] },
    { num: 11, name: 'Tháng 11', solar: 'Tháng Mười Một', alias: ['tháng 11', 'tháng mười một', 'tiểu tuyết', 'đại tuyết'] },
    { num: 12, name: 'Tháng 12', solar: 'Tháng Chạp', alias: ['tháng 12', 'tháng chạp', 'đông chí', 'tiểu hàn', 'đại hàn'] },
  ];

  const filteredCrops = data.danh_sach_nong_vu.filter(crop => {
    const qClean = searchTerm.toLowerCase().trim();
    const matchSearch = !qClean ||
      crop.ten_cay_trong.toLowerCase().includes(qClean) ||
      (crop.ten_goi_khac && crop.ten_goi_khac.toLowerCase().includes(qClean)) ||
      crop.khu_vuc_ap_dung.toLowerCase().includes(qClean) ||
      crop.phuong_phap_canh_tac_truyen_thong.toLowerCase().includes(qClean);

    const matchRegion = 
      selectedRegion === 'all' || 
      crop.khu_vuc_ap_dung.toLowerCase().includes(selectedRegion.toLowerCase());

    const matchGroup = 
      selectedGroup === 'all' || 
      (crop.nhom_cay && crop.nhom_cay.toLowerCase().includes(selectedGroup.toLowerCase()));

    const matchSeason = 
      selectedSeason === 'all' || 
      crop.mua_vu.toLowerCase().includes(selectedSeason.toLowerCase());

    return matchSearch && matchRegion && matchGroup && matchSeason;
  });

  // Requirement 6: Helper to check activities for a given month
  const checkMonthActivities = (crop: NongVuRecord, monthNum: number) => {
    const targetMonth = months.find(m => m.num === monthNum);
    const keywords = targetMonth ? targetMonth.alias : [`tháng ${monthNum}`];

    const gieoStr = crop.thoi_gian_gieo_trong.toLowerCase();
    const chamStr = crop.thoi_gian_cham_soc.toLowerCase();
    const thuStr = crop.thoi_gian_thu_hoach.toLowerCase();

    const isGieo = keywords.some(k => gieoStr.includes(k));
    const isCham = keywords.some(k => chamStr.includes(k));
    const isThu = keywords.some(k => thuStr.includes(k));

    return { isGieo, isCham, isThu, hasAny: isGieo || isCham || isThu };
  };

  // Crops active in selected month
  const monthActiveCrops = filteredCrops.filter(c => checkMonthActivities(c, selectedMonth).hasAny);

  const handleCopyCitation = (e: React.MouseEvent, crop: NongVuRecord) => {
    e.stopPropagation();
    if (!hasSource(crop)) {
      setToastMessage('Bản ghi này chưa có thông tin nguồn tư liệu để trích dẫn.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const citation = buildSourceCitation(crop);
    navigator.clipboard.writeText(citation);
    setCopiedId(crop.id || crop.ten_cay_trong);
    setToastMessage(`Đã sao chép trích dẫn: "${crop.nguon_tu_lieu.slice(0, 35)}..."`);
    setTimeout(() => {
      setCopiedId(null);
      setToastMessage(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-stone-700 flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2.5">
              <Calendar className="w-8 h-8 text-emerald-700" />
              <span>Lịch Nông Vụ Chi Tiết Việt Nam</span>
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Khung gieo trồng, chăm sóc và thu hoạch chi tiết phân theo tháng và vùng sinh thái Bắc - Trung - Nam.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex bg-stone-200/80 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setViewMode('month_detail')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'month_detail' 
                  ? 'bg-white text-emerald-900 shadow-xs font-bold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Theo tháng (Chi tiết hoạt động)</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'cards' 
                  ? 'bg-white text-emerald-900 shadow-xs font-bold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Thẻ chi tiết</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'timeline' 
                  ? 'bg-white text-emerald-900 shadow-xs font-bold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>Ma trận 12 tháng</span>
            </button>
            <button
              onClick={() => setViewMode('seasons')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'seasons' 
                  ? 'bg-white text-emerald-900 shadow-xs font-bold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>4 Mùa vụ</span>
            </button>
          </div>
        </div>

        {/* Regional Alert */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-xs text-amber-950 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Khuyến nghị về tính sai biệt vùng miền:</span>
            <p className="leading-relaxed text-amber-900">
              Tuyệt đối không áp dụng cùng một lịch gieo cấy cho mọi địa phương. Thời vụ tại mỗi tỉnh có thể xê dịch từ 15 đến 30 ngày theo khí hậu và điều kiện sản xuất cụ thể.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm cây trồng, tên khác, khu vực canh tác..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600"
              >
                Xóa
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-stone-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Khu vực:
            </span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>

            <span className="font-semibold text-stone-600 ml-2">Mùa vụ:</span>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            <span className="font-semibold text-stone-600 ml-2">Loại cây:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Tất cả</option>
              {data.nhom_cay_trong.map((g) => (
                <option key={g.id} value={g.ten}>{g.ten}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* REQUIREMENT 6: MONTHLY VIEW OF FARMING ACTIVITIES */}
      {viewMode === 'month_detail' && (
        <div className="space-y-6">
          {/* Month Selector Pills 1 to 12 */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Chọn tháng theo dõi hoạt động nông vụ:</span>
              </span>
              <span className="text-xs text-emerald-800 font-medium">
                Đang xem: <strong>Tháng {selectedMonth}</strong> ({months[selectedMonth - 1].solar})
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
              {months.map((m) => {
                const isSelected = selectedMonth === m.num;
                return (
                  <button
                    key={m.num}
                    onClick={() => setSelectedMonth(m.num)}
                    className={`py-2 px-1 rounded-xl text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-800 text-white font-bold shadow-sm scale-105'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold">{m.name}</div>
                    <div className="text-[10px] opacity-80 truncate">{m.solar}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month Activity Results or Clear Missing Data Notice */}
          {monthActiveCrops.length === 0 ? (
            /* REQUIREMENT 6: Clear notice when no data for a month or region, no guessing! */
            <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-stone-300 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                Chưa có dữ liệu lịch nông vụ cho Tháng {selectedMonth} ({months[selectedMonth - 1].solar})
                {selectedRegion !== 'all' && <span> tại khu vực {regions.find(r => r.id === selectedRegion)?.label}</span>}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                Trong tệp dữ liệu <code>nongvu.json</code> hiện thời chưa có ghi nhận hoạt động canh tác nào cho mốc thời gian hoặc khu vực này. Tuân thủ tôn chỉ đạo đức dữ liệu, hệ thống tuyệt đối <strong>không tự suy đoán hoặc tự điền thông tin thay thế</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSelectedRegion('all')}
                  className="px-4 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl"
                >
                  Xem dữ liệu của toàn quốc cho Tháng {selectedMonth}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                <span>
                  Có <strong>{monthActiveCrops.length}</strong> loại cây trồng có hoạt động trong <strong>Tháng {selectedMonth}</strong>:
                </span>
                <span className="text-emerald-800 font-medium">Bấm vào cây để xem trọn vẹn 11 trường chi tiết</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monthActiveCrops.map((crop) => {
                  const acts = checkMonthActivities(crop, selectedMonth);
                  const cropHasSrc = hasSource(crop);
                  const isUnspecified = isRegionOrTimeUnspecified(crop);

                  return (
                    <div
                      key={crop.id || crop.ten_cay_trong}
                      onClick={() => onSelectCrop(crop)}
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {crop.nhom_cay || 'Cây trồng'}
                          </span>

                          {/* Requirement 8: Tag */}
                          {crop.loai_thong_tin === 'truyen_thong' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900 text-amber-300">
                              Tri thức cổ truyền
                            </span>
                          )}
                          {crop.loai_thong_tin === 'hien_dai' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-900 text-sky-200">
                              Kỹ thuật hiện đại
                            </span>
                          )}

                          {/* Requirement 2: Orange warning if source missing */}
                          {!cropHasSrc && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-amber-950">
                              Chưa có nguồn tư liệu
                            </span>
                          )}
                        </div>

                        {/* Requirement 9: Warning banner */}
                        {isUnspecified && (
                          <div className="bg-rose-50 border border-rose-300 text-rose-900 text-[11px] p-2 rounded-xl flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Chưa xác định rõ khu vực hoặc thời gian áp dụng</span>
                          </div>
                        )}

                        <div>
                          <h4 className="font-serif font-bold text-lg text-stone-900 hover:text-emerald-700 transition-colors">
                            {crop.ten_cay_trong}
                          </h4>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{crop.khu_vuc_ap_dung}</span>
                          </p>
                        </div>

                        {/* Activities happening in this month */}
                        <div className="space-y-1.5 pt-1 text-xs">
                          {acts.isGieo && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-2.5 rounded-xl">
                              <strong className="text-emerald-800 flex items-center gap-1 mb-0.5">
                                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Hoạt động gieo trồng / cấy trong tháng:</span>
                              </strong>
                              <p className="text-stone-700">{crop.thoi_gian_gieo_trong}</p>
                            </div>
                          )}

                          {acts.isCham && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-950 p-2.5 rounded-xl">
                              <strong className="text-amber-800 flex items-center gap-1 mb-0.5">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Hoạt động chăm sóc trong tháng:</span>
                              </strong>
                              <p className="text-stone-700">{crop.thoi_gian_cham_soc}</p>
                            </div>
                          )}

                          {acts.isThu && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-950 p-2.5 rounded-xl">
                              <strong className="text-rose-800 flex items-center gap-1 mb-0.5">
                                <Scissors className="w-3.5 h-3.5 text-rose-600" />
                                <span>Hoạt động thu hoạch trong tháng:</span>
                              </strong>
                              <p className="text-stone-700">{crop.thoi_gian_thu_hoach}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Requirement 1 & 4: Permanent sources footer + Copy citation */}
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-700 flex items-center gap-1">
                            <BookMarked className="w-3.5 h-3.5 text-stone-400" />
                            <span>Nguồn tư liệu đối chiếu:</span>
                          </span>
                          {cropHasSrc && (
                            <button
                              onClick={(e) => handleCopyCitation(e, crop)}
                              className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1"
                              title="Sao chép trích dẫn nguồn"
                            >
                              {copiedId === (crop.id || crop.ten_cay_trong) ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === (crop.id || crop.ten_cay_trong) ? 'Đã chép' : 'Sao chép'}</span>
                            </button>
                          )}
                        </div>
                        <p className="text-stone-800">
                          {crop.nguon_tu_lieu || <span className="text-amber-800 italic font-semibold">Chưa có nguồn tư liệu</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: CARDS (With Requirement 1 permanent source block & Requirement 4 copy button) */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {filteredCrops.map((crop) => {
            const cropHasSrc = hasSource(crop);
            const isUnspecified = isRegionOrTimeUnspecified(crop);

            return (
              <div 
                key={crop.id || crop.ten_cay_trong}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="bg-gradient-to-r from-stone-50 via-emerald-50/50 to-stone-50 p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800 text-amber-200">
                        {crop.nhom_cay || 'Cây trồng'}
                      </span>

                      {/* Requirement 8: Classification */}
                      {crop.loai_thong_tin === 'truyen_thong' && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-900 text-amber-300">
                          Tri thức cổ truyền
                        </span>
                      )}
                      {crop.loai_thong_tin === 'hien_dai' && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-900 text-sky-200">
                          Kỹ thuật hiện đại
                        </span>
                      )}

                      {/* Requirement 2: Orange warning if source missing */}
                      {!cropHasSrc && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-amber-950 border border-amber-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Chưa có nguồn tư liệu</span>
                        </span>
                      )}

                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300">
                        {crop.mua_vu}
                      </span>
                    </div>

                    <h2 
                      onClick={() => onSelectCrop(crop)}
                      className="text-xl sm:text-2xl font-serif font-bold text-stone-900 hover:text-emerald-700 cursor-pointer transition-colors"
                    >
                      {crop.ten_cay_trong}
                    </h2>
                    {crop.ten_goi_khac && (
                      <span className="text-xs text-stone-500 italic">
                        (Tên gọi khác: {crop.ten_goi_khac})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end text-xs text-stone-600 gap-2">
                    <div className="flex items-center gap-1 font-medium text-emerald-800">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{crop.khu_vuc_ap_dung}</span>
                    </div>
                    <button
                      onClick={() => onSelectCrop(crop)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs transition-colors self-start sm:self-auto"
                    >
                      Xem chi tiết đầy đủ 11 trường
                    </button>
                  </div>
                </div>

                {/* Requirement 9: Warning banner */}
                {isUnspecified && (
                  <div className="bg-rose-50 border-b border-rose-300 px-5 py-2.5 text-xs text-rose-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cảnh báo: Thông tin lịch nông vụ này chưa xác định rõ khu vực hoặc thời gian áp dụng cụ thể.</span>
                  </div>
                )}

                <div className="p-5 space-y-4">
                  {/* Stages */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                        <Sprout className="w-4 h-4 text-emerald-600" />
                        <span>Thời gian gieo trồng</span>
                      </div>
                      <p className="text-stone-800 text-xs leading-relaxed font-medium">
                        {crop.thoi_gian_gieo_trong}
                      </p>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs mb-1">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Thời gian chăm sóc</span>
                      </div>
                      <p className="text-stone-800 text-xs leading-relaxed font-medium">
                        {crop.thoi_gian_cham_soc}
                      </p>
                    </div>

                    <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs mb-1">
                        <Scissors className="w-4 h-4 text-rose-600" />
                        <span>Thời gian thu hoạch</span>
                      </div>
                      <p className="text-stone-800 text-xs leading-relaxed font-medium">
                        {crop.thoi_gian_thu_hoach}
                      </p>
                    </div>
                  </div>

                  {/* Conditions & Folk Lore */}
                  {crop.kinh_nghiem_dan_gian && (
                    <div className="bg-amber-50/80 border-l-2 border-amber-500 p-2.5 rounded-r-lg text-xs font-serif italic text-amber-950">
                      "{crop.kinh_nghiem_dan_gian}"
                    </div>
                  )}

                  {/* REQUIREMENT 1: PERMANENT SOURCE BLOCK AT BOTTOM (NOT HIDDEN) */}
                  <div className="border border-emerald-200 bg-emerald-50/70 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-emerald-200/70 pb-1.5">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <BookMarked className="w-4 h-4 text-emerald-700" />
                        <span>Nguồn tư liệu đối chiếu:</span>
                      </span>

                      {/* Requirement 4: Copy button */}
                      {cropHasSrc && (
                        <button
                          onClick={(e) => handleCopyCitation(e, crop)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-semibold transition-colors shadow-xs"
                        >
                          {copiedId === (crop.id || crop.ten_cay_trong) ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === (crop.id || crop.ten_cay_trong) ? 'Đã sao chép' : 'Sao chép trích dẫn nguồn'}</span>
                        </button>
                      )}
                    </div>

                    {cropHasSrc ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <strong className="text-stone-700 block">Tên tài liệu:</strong>
                          <span className="text-stone-900 font-medium">{crop.nguon_tu_lieu}</span>
                        </div>
                        <div>
                          <strong className="text-stone-700 block">Tác giả / Đơn vị cung cấp:</strong>
                          <span className="text-stone-900 font-medium">{crop.tac_gia_don_vi || 'Theo tư liệu nông nghiệp'}</span>
                        </div>
                        <div>
                          <strong className="text-stone-700 block">Đường dẫn tham khảo:</strong>
                          {crop.duong_dan_tham_khao ? (
                            <a href={crop.duong_dan_tham_khao} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline flex items-center gap-1 truncate">
                              <span>{crop.duong_dan_tham_khao}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-stone-500 italic">Chưa có liên kết web</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-amber-900 font-semibold italic flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Chưa có nguồn tư liệu. Hệ thống không tự tạo nguồn thay thế.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 3: 12-MONTH MATRIX TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs overflow-x-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Bảng Tiến Trình Canh Tác 12 Tháng Dương Lịch / Âm Lịch
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Gieo trồng / cấy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Chăm sóc / bón thúc
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Thu hoạch
              </span>
            </div>
          </div>

          <table className="w-full min-w-[760px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-200">
                <th className="p-3 font-bold text-stone-800 w-48">Cây trồng</th>
                <th className="p-3 font-bold text-stone-800 w-36">Khu vực</th>
                {months.map((m) => (
                  <th key={m.num} className="p-2 text-center font-bold text-stone-800 border-l border-stone-200">
                    <div>{m.name}</div>
                    <div className="text-[9px] text-stone-400 font-normal">{m.solar.replace('Tháng ', '')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredCrops.map((crop) => (
                <tr 
                  key={crop.id || crop.ten_cay_trong}
                  onClick={() => onSelectCrop(crop)}
                  className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                >
                  <td className="p-3 font-bold text-stone-900">
                    <div className="text-emerald-900 hover:underline">{crop.ten_cay_trong}</div>
                    <div className="text-[10px] text-stone-500 font-normal">{crop.mua_vu}</div>
                  </td>
                  <td className="p-3 text-stone-600 text-[11px]">
                    {crop.khu_vuc_ap_dung.split(',')[0]}
                  </td>
                  {months.map((m) => {
                    const acts = checkMonthActivities(crop, m.num);
                    return (
                      <td key={m.num} className="p-1 text-center border-l border-stone-200 align-middle">
                        {acts.isGieo && (
                          <div className="bg-emerald-100 text-emerald-800 font-bold py-1 rounded text-[10px] border border-emerald-300">
                            Gieo
                          </div>
                        )}
                        {acts.isCham && !acts.isGieo && (
                          <div className="bg-amber-100 text-amber-800 font-bold py-1 rounded text-[10px] border border-amber-300">
                            Chăm
                          </div>
                        )}
                        {acts.isThu && !acts.isGieo && !acts.isCham && (
                          <div className="bg-rose-100 text-rose-800 font-bold py-1 rounded text-[10px] border border-rose-300">
                            Gặt
                          </div>
                        )}
                        {!acts.hasAny && (
                          <div className="text-stone-300 text-[10px]">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW MODE 4: ORGANIZED BY 4 SEASONS */}
      {viewMode === 'seasons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Season 1: Vụ Chiêm Xuân */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Vụ Chiêm Xuân (Đông Xuân)</h3>
                <p className="text-xs text-stone-500">Tháng 11 - tháng 5 âm lịch (bắt đầu trong giá rét, thu hoạch đầu hè)</p>
              </div>
            </div>
            <div className="space-y-2">
              {data.danh_sach_nong_vu
                .filter(c => c.mua_vu.toLowerCase().includes('chiêm') || c.mua_vu.toLowerCase().includes('đông xuân') || c.mua_vu.toLowerCase().includes('xuân'))
                .map(crop => (
                  <div 
                    key={crop.id}
                    onClick={() => onSelectCrop(crop)}
                    className="p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-100/70 cursor-pointer border border-emerald-200/60 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-emerald-950">{crop.ten_cay_trong}</div>
                      <div className="text-[11px] text-stone-600">{crop.khu_vuc_ap_dung}</div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-md bg-white text-emerald-800 font-semibold shadow-xs">
                      Chi tiết
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Season 2: Vụ Hè Thu */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Vụ Hè Thu</h3>
                <p className="text-xs text-stone-500">Tháng 4 - tháng 8 dương lịch</p>
              </div>
            </div>
            <div className="space-y-2">
              {data.danh_sach_nong_vu
                .filter(c => c.mua_vu.toLowerCase().includes('hè thu') || c.mua_vu.toLowerCase().includes('xuân hè'))
                .map(crop => (
                  <div 
                    key={crop.id}
                    onClick={() => onSelectCrop(crop)}
                    className="p-3 rounded-xl bg-amber-50/50 hover:bg-amber-100/70 cursor-pointer border border-amber-200/60 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-amber-950">{crop.ten_cay_trong}</div>
                      <div className="text-[11px] text-stone-600">{crop.khu_vuc_ap_dung}</div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-md bg-white text-amber-800 font-semibold shadow-xs">
                      Chi tiết
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Season 3: Vụ Mùa */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Vụ Mùa (Hạ Thu)</h3>
                <p className="text-xs text-stone-500">Tháng 5 - tháng 10 âm lịch</p>
              </div>
            </div>
            <div className="space-y-2">
              {data.danh_sach_nong_vu
                .filter(c => c.mua_vu.toLowerCase().includes('vụ mùa') || c.mua_vu.toLowerCase().includes('hạ thu'))
                .map(crop => (
                  <div 
                    key={crop.id}
                    onClick={() => onSelectCrop(crop)}
                    className="p-3 rounded-xl bg-orange-50/50 hover:bg-orange-100/70 cursor-pointer border border-orange-200/60 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-orange-950">{crop.ten_cay_trong}</div>
                      <div className="text-[11px] text-stone-600">{crop.khu_vuc_ap_dung}</div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-md bg-white text-orange-800 font-semibold shadow-xs">
                      Chi tiết
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Season 4: Vụ Đông & Cây Lâu Năm */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Vụ Đông & Cây Lâu Năm</h3>
                <p className="text-xs text-stone-500">Đặc sản hoa màu ưa lạnh miền Bắc & cây công nghiệp lâu năm</p>
              </div>
            </div>
            <div className="space-y-2">
              {data.danh_sach_nong_vu
                .filter(c => c.mua_vu.toLowerCase().includes('đông') || c.mua_vu.toLowerCase().includes('lâu năm'))
                .map(crop => (
                  <div 
                    key={crop.id}
                    onClick={() => onSelectCrop(crop)}
                    className="p-3 rounded-xl bg-teal-50/50 hover:bg-teal-100/70 cursor-pointer border border-teal-200/60 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-teal-950">{crop.ten_cay_trong}</div>
                      <div className="text-[11px] text-stone-600">{crop.khu_vuc_ap_dung}</div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-md bg-white text-teal-800 font-semibold shadow-xs">
                      Chi tiết
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
