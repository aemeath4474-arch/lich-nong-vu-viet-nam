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
  BookOpen
} from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'cards' | 'timeline' | 'seasons'>('cards');

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

  const filteredCrops = data.danh_sach_nong_vu.filter(crop => {
    const matchSearch = 
      crop.ten_cay_trong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop.ten_goi_khac && crop.ten_goi_khac.toLowerCase().includes(searchTerm.toLowerCase())) ||
      crop.khu_vuc_ap_dung.toLowerCase().includes(searchTerm.toLowerCase());

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

  const months = [
    { num: 1, name: 'Th.1', lunar: 'Tháng Giêng' },
    { num: 2, name: 'Th.2', lunar: 'Tháng Hai' },
    { num: 3, name: 'Th.3', lunar: 'Tháng Ba' },
    { num: 4, name: 'Th.4', lunar: 'Tháng Tư' },
    { num: 5, name: 'Th.5', lunar: 'Tháng Năm' },
    { num: 6, name: 'Th.6', lunar: 'Tháng Sáu' },
    { num: 7, name: 'Th.7', lunar: 'Tháng Bảy' },
    { num: 8, name: 'Th.8', lunar: 'Tháng Tám' },
    { num: 9, name: 'Th.9', lunar: 'Tháng Chín' },
    { num: 10, name: 'Th.10', lunar: 'Tháng Mười' },
    { num: 11, name: 'Th.11', lunar: 'Tháng Một' },
    { num: 12, name: 'Th.12', lunar: 'Tháng Chạp' },
  ];

  // Helper to approximate active months for timeline visual
  const getCropStageForMonth = (crop: NongVuRecord, monthNum: number): 'gieo' | 'cham' | 'thu' | 'none' => {
    const textGieo = crop.thoi_gian_gieo_trong.toLowerCase();
    const textCham = crop.thoi_gian_cham_soc.toLowerCase();
    const textThu = crop.thoi_gian_thu_hoach.toLowerCase();

    // Check Gieo
    if (
      textGieo.includes(`tháng ${monthNum}`) || 
      (monthNum === 1 && textGieo.includes('tháng giêng')) ||
      (monthNum === 12 && textGieo.includes('tháng chạp')) ||
      (monthNum === 11 && textGieo.includes('tháng 11'))
    ) {
      return 'gieo';
    }

    // Check Thu
    if (
      textThu.includes(`tháng ${monthNum}`) ||
      (monthNum === 12 && textThu.includes('tháng 12')) ||
      (monthNum === 5 && textThu.includes('tháng 5')) ||
      (monthNum === 8 && textThu.includes('tháng 8')) ||
      (monthNum === 10 && textThu.includes('tháng 10'))
    ) {
      return 'thu';
    }

    // Check Chăm
    if (textCham.includes(`tháng ${monthNum}`)) {
      return 'cham';
    }

    return 'none';
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title & Regional Mandate Alert */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
              <Calendar className="w-8 h-8 text-emerald-700" />
              <span>Lịch Nông Vụ Chi Tiết Việt Nam</span>
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Khung gieo trồng, thời gian chăm sóc và thu hoạch chi tiết theo từng loại cây và vùng miền sinh thái.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex bg-stone-200/80 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'cards' 
                  ? 'bg-white text-emerald-900 shadow-xs' 
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
                  ? 'bg-white text-emerald-900 shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Ma trận 12 tháng</span>
            </button>
            <button
              onClick={() => setViewMode('seasons')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'seasons' 
                  ? 'bg-white text-emerald-900 shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Theo 4 Mùa vụ</span>
            </button>
          </div>
        </div>

        {/* Mandatory Warning: Do not claim one calendar applies everywhere */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-xs text-amber-950 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Quy luật vùng miền trong canh tác Việt Nam:</span>
            <p className="leading-relaxed text-amber-900">
              Tuyệt đối không áp dụng một lịch gieo trồng duy nhất cho mọi địa phương. Do sự khác biệt về địa hình, vĩ độ và khí hậu (Miền Bắc có mùa đông rét buốt mưa phùn, Miền Trung mưa lũ muộn, Miền Nam hai mùa mưa - nắng rõ rệt), khung thời vụ tại mỗi tỉnh thành có thể xê dịch từ 15 đến 30 ngày. Bà con cần kết hợp theo dõi con nước, tiết khí và thông báo khuyến nông địa phương.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên cây, tên khác, khu vực..."
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

          {/* Region Dropdown / Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-stone-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Vùng:
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

            <span className="font-semibold text-stone-600 ml-2">Nhóm cây:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Tất cả nhóm cây</option>
              {data.nhom_cay_trong.map((g) => (
                <option key={g.id} value={g.ten}>{g.ten}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Đang hiển thị <strong>{filteredCrops.length}</strong> / {data.danh_sach_nong_vu.length} bản ghi mùa vụ</span>
          {(selectedRegion !== 'all' || selectedSeason !== 'all' || selectedGroup !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedRegion('all');
                setSelectedSeason('all');
                setSelectedGroup('all');
                setSearchTerm('');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium underline"
            >
              Đặt lại tất cả bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: COMPREHENSIVE CARDS (Full 11 Fields displayed clearly) */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {filteredCrops.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-300">
              <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">Không có bản ghi phù hợp với tiêu chí lọc.</p>
              <p className="text-xs text-stone-500 mt-1">Vui lòng thay đổi khu vực hoặc mùa vụ để xem kết quả.</p>
            </div>
          ) : (
            filteredCrops.map((crop) => (
              <div 
                key={crop.id || crop.ten_cay_trong}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-500/80 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header of Crop Card */}
                <div className="bg-gradient-to-r from-stone-50 via-emerald-50/50 to-stone-50 p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800 text-amber-200">
                        {crop.nhom_cay || 'Cây trồng'}
                      </span>
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

                  <div className="flex flex-col sm:items-end text-xs text-stone-600 gap-1">
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

                {/* Body: 3 Stages breakdown */}
                <div className="p-5 space-y-4">
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

                  {/* Conditions & Traditional Practices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                      <span className="font-bold text-stone-800 block mb-1">
                        Điều kiện canh tác & thời tiết phù hợp:
                      </span>
                      <p className="text-stone-600 leading-relaxed">
                        {crop.dieu_kien_canh_tac}
                      </p>
                    </div>

                    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                      <span className="font-bold text-stone-800 block mb-1">
                        Phương pháp canh tác truyền thống:
                      </span>
                      <p className="text-stone-600 leading-relaxed">
                        {crop.phuong_phap_canh_tac_truyen_thong}
                      </p>
                    </div>
                  </div>

                  {/* Folk Wisdom & Sources */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
                    {crop.kinh_nghiem_dan_gian && (
                      <div className="bg-amber-50/80 border-l-2 border-amber-500 px-3 py-1.5 rounded-r-lg font-serif italic text-amber-900 flex-1">
                        "{crop.kinh_nghiem_dan_gian}"
                      </div>
                    )}
                    <div className="text-[11px] text-stone-500 shrink-0 self-end">
                      <strong>Nguồn tư liệu:</strong> {crop.nguon_tu_lieu.split(';')[0]}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW MODE 2: 12-MONTH TIMELINE MATRIX */}
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
                <th className="p-3 font-bold text-stone-800 w-48">Cây trồng & Mùa vụ</th>
                <th className="p-3 font-bold text-stone-800 w-36">Khu vực</th>
                {months.map((m) => (
                  <th key={m.num} className="p-2 text-center font-bold text-stone-800 border-l border-stone-200">
                    <div>{m.name}</div>
                    <div className="text-[9px] text-stone-400 font-normal">{m.lunar.replace('Tháng ', '')}</div>
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
                    const stage = getCropStageForMonth(crop, m.num);
                    return (
                      <td key={m.num} className="p-1 text-center border-l border-stone-200 align-middle">
                        {stage === 'gieo' && (
                          <div className="bg-emerald-100 text-emerald-800 font-bold py-1.5 rounded-md text-[10px] border border-emerald-300">
                            Gieo
                          </div>
                        )}
                        {stage === 'cham' && (
                          <div className="bg-amber-100 text-amber-800 font-bold py-1.5 rounded-md text-[10px] border border-amber-300">
                            Chăm
                          </div>
                        )}
                        {stage === 'thu' && (
                          <div className="bg-rose-100 text-rose-800 font-bold py-1.5 rounded-md text-[10px] border border-rose-300">
                            Gặt
                          </div>
                        )}
                        {stage === 'none' && (
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

      {/* VIEW MODE 3: ORGANIZED BY 4 TRADITIONAL SEASONS */}
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
                      Gieo: {crop.thoi_gian_gieo_trong.split(':')[0] || 'Vụ xuân'}
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
                <p className="text-xs text-stone-500">Tháng 4 - tháng 8 dương lịch (thời kỳ mưa nhiều, nắng nóng gay gắt)</p>
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
                <h3 className="font-serif font-bold text-lg text-stone-900">Vụ Mùa (Chính Vụ Cổ Truyền)</h3>
                <p className="text-xs text-stone-500">Tháng 5 - tháng 10 âm lịch (vụ gặt lớn nhất trong năm của cư dân Bắc Bộ)</p>
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
