import React, { useState } from 'react';
import { NongVuRecord } from '../types.ts';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Sprout, 
  Scissors, 
  CloudSun, 
  Hammer, 
  Quote, 
  BookMarked,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { buildSourceCitation, hasSource, isRegionOrTimeUnspecified } from '../utils/sourceUtils.ts';

interface CropDetailModalProps {
  crop: NongVuRecord | null;
  onClose: () => void;
  onAskAboutCrop?: (cropName: string) => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({ crop, onClose, onAskAboutCrop }) => {
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [citationNotice, setCitationNotice] = useState<string | null>(null);

  if (!crop) return null;

  const cropHasSource = hasSource(crop);
  const regionUnspecified = isRegionOrTimeUnspecified(crop);

  const handleCopyCitation = () => {
    if (!cropHasSource) {
      setCitationNotice('Bản ghi này chưa có thông tin nguồn tư liệu để trích dẫn.');
      setTimeout(() => setCitationNotice(null), 3000);
      return;
    }

    const citation = buildSourceCitation(crop);
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setCitationNotice('Đã sao chép trích dẫn nguồn vào bộ nhớ tạm.');
    setTimeout(() => {
      setCopiedCitation(false);
      setCitationNotice(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-50 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-emerald-900/60 hover:bg-emerald-900 text-white transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-emerald-950">
              {crop.nhom_cay || 'Cây trồng'}
            </span>

            {/* Requirement 8: Tag for Traditional vs Modern Technical vs Unclassified */}
            {crop.loai_thong_tin === 'truyen_thong' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/90 text-amber-200 border border-emerald-600 flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5" />
                <span>Tri thức canh tác truyền thống</span>
              </span>
            )}
            {crop.loai_thong_tin === 'hien_dai' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-900 text-sky-200 border border-sky-600 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Thông tin kỹ thuật hiện đại</span>
              </span>
            )}
            {/* If no classification in data, DO NOT invent one */}

            {/* Requirement 2: Orange warning if source is missing */}
            {!cropHasSource && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-amber-950 border border-amber-600 shadow-xs flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Chưa có nguồn tư liệu</span>
              </span>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/80 text-emerald-100 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {crop.mua_vu}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {crop.ten_cay_trong}
          </h2>
          {crop.ten_goi_khac && (
            <p className="text-emerald-200 text-sm mt-1 italic">
              Tên gọi khác: {crop.ten_goi_khac}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 text-emerald-100 text-sm">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Khu vực áp dụng: <strong>{crop.khu_vuc_ap_dung || 'Chưa xác định cụ thể'}</strong></span>
          </div>
        </div>

        {/* Requirement 9: Warning banner when area or time is unspecified */}
        {regionUnspecified && (
          <div className="bg-rose-50 border-b border-rose-300 px-6 py-3 flex items-start gap-3 text-rose-900 text-xs sm:text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-rose-950 font-bold">Cảnh báo thông tin chưa xác định rõ:</strong>
              <p className="leading-relaxed">
                Thông tin lịch nông vụ này chưa xác định rõ khu vực hoặc thời gian áp dụng cụ thể. Tuyệt đối không áp dụng như một khuyến nghị canh tác chính xác cho mọi địa phương do điều kiện thổ nhưỡng và thời tiết vùng miền khác biệt.
              </p>
            </div>
          </div>
        )}

        {/* General Regional Notice */}
        {!regionUnspecified && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 flex items-start gap-2.5 text-amber-900 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Lưu ý thời vụ:</strong> Lịch gieo trồng mang tính tham khảo theo khung thời vụ vùng miền. Bà con cần kết hợp theo dõi con nước và tiết trời tại chỗ.
            </p>
          </div>
        )}

        {/* Content Body - Scrollable */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Timeline 3 Stages: Gieo trồng - Chăm sóc - Thu hoạch */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              Tiến Trình Thời Vụ Canh Tác
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Thời gian gieo trồng</span>
                </div>
                <p className="text-stone-800 text-sm leading-relaxed font-medium">
                  {crop.thoi_gian_gieo_trong || 'Chưa có thông tin'}
                </p>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Thời gian chăm sóc</span>
                </div>
                <p className="text-stone-800 text-sm leading-relaxed font-medium">
                  {crop.thoi_gian_cham_soc || 'Chưa có thông tin'}
                </p>
              </div>

              <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm mb-1.5">
                  <Scissors className="w-4 h-4 text-rose-600" />
                  <span>Thời gian thu hoạch</span>
                </div>
                <p className="text-stone-800 text-sm leading-relaxed font-medium">
                  {crop.thoi_gian_thu_hoach || 'Chưa có thông tin'}
                </p>
              </div>
            </div>
          </div>

          {/* Điều kiện canh tác */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-600" />
              Điều Kiện Thời Tiết & Thổ Nhưỡng
            </h4>
            <p className="text-stone-700 text-sm leading-relaxed">
              {crop.dieu_kien_canh_tac || 'Chưa có thông tin điều kiện canh tác.'}
            </p>
          </div>

          {/* Phương pháp canh tác */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Hammer className="w-4 h-4 text-emerald-700" />
              Phương Pháp Canh Tác
            </h4>
            <p className="text-stone-700 text-sm leading-relaxed">
              {crop.phuong_phap_canh_tac_truyen_thong || 'Chưa có thông tin phương pháp canh tác.'}
            </p>
          </div>

          {/* Kinh nghiệm dân gian & Ca dao */}
          {crop.kinh_nghiem_dan_gian && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                <Quote className="w-4 h-4 text-amber-700" />
                Kinh Nghiệm Dân Gian & Ca Dao Nông Vụ
              </h4>
              <p className="text-amber-950 font-serif italic text-sm sm:text-base leading-relaxed">
                {crop.kinh_nghiem_dan_gian}
              </p>
            </div>
          )}

          {/* REQUIREMENT 1: PERMANENT SOURCE BLOCK AT BOTTOM (NEVER HIDDEN) */}
          <div className="border-2 border-emerald-700/30 bg-emerald-50/70 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <BookMarked className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Nguồn Tư Liệu & Cơ Sở Đối Chiếu (Bắt Buộc Công Khai)</span>
              </div>

              {/* Requirement 4: Copy Citation Button */}
              <button
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors self-start sm:self-auto shadow-xs"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? 'Đã sao chép trích dẫn' : 'Sao chép trích dẫn nguồn'}</span>
              </button>
            </div>

            {citationNotice && (
              <div className="text-xs font-medium text-emerald-800 bg-emerald-100 p-2 rounded-lg border border-emerald-200">
                {citationNotice}
              </div>
            )}

            {cropHasSource ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-700 block mb-0.5">Tên tài liệu / Văn bản:</span>
                  <p className="text-stone-900 font-medium">{crop.nguon_tu_lieu}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-700 block mb-0.5">Tác giả hoặc Đơn vị cung cấp:</span>
                  <p className="text-stone-900 font-medium">
                    {crop.tac_gia_don_vi || 'Chưa ghi nhận tác giả/đơn vị trong dữ liệu'}
                    {crop.nam_xuat_ban ? ` (${crop.nam_xuat_ban})` : ''}
                  </p>
                </div>

                <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-700 block mb-0.5">Đường dẫn tham khảo:</span>
                  {crop.duong_dan_tham_khao ? (
                    <a 
                      href={crop.duong_dan_tham_khao} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-emerald-700 hover:text-emerald-900 underline font-medium flex items-center gap-1 break-all"
                    >
                      <span>{crop.duong_dan_tham_khao}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-stone-500 italic">Chưa có đường dẫn trực tuyến trong dữ liệu</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-amber-100/80 border border-amber-300 p-3 rounded-xl text-xs text-amber-950 flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Bản ghi này hiện chưa có nguồn tư liệu chính thức được ghi nhận trong tệp nongvu.json. Hệ thống tuyệt đối không tự tạo nguồn thay thế.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-100 px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500">
            Mã lưu trữ: <span className="font-mono">{crop.id || 'nongvu-record'}</span>
          </div>
          <div className="flex items-center gap-2">
            {onAskAboutCrop && (
              <button
                onClick={() => {
                  onAskAboutCrop(crop.ten_cay_trong);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Hỏi Gemini về cây này
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
