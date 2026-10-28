import React from 'react';
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
  Sparkles
} from 'lucide-react';

interface CropDetailModalProps {
  crop: NongVuRecord | null;
  onClose: () => void;
  onAskAboutCrop?: (cropName: string) => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({ crop, onClose, onAskAboutCrop }) => {
  if (!crop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-50 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 sm:p-6 relative">
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
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/80 text-emerald-100 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {crop.mua_vu}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            {crop.ten_cay_trong}
          </h2>
          {crop.ten_goi_khac && (
            <p className="text-emerald-200 text-sm mt-1 italic">
              Tên gọi khác: {crop.ten_goi_khac}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 text-emerald-100 text-sm">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Khu vực áp dụng: <strong>{crop.khu_vuc_ap_dung}</strong></span>
          </div>
        </div>

        {/* Regional Alert Notice */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-3 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Lưu ý quan trọng về thời vụ:</strong> Lịch gieo trồng chỉ mang tính tham khảo theo khung thời vụ truyền thống của khu vực ghi nhận. Thời tiết, thổ nhưỡng từng địa phương có thể sai khác, bà con nên kết hợp theo dõi con nước và tiết trời tại chỗ.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
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
                  {crop.thoi_gian_gieo_trong}
                </p>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Thời gian chăm sóc</span>
                </div>
                <p className="text-stone-800 text-sm leading-relaxed font-medium">
                  {crop.thoi_gian_cham_soc}
                </p>
              </div>

              <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm mb-1.5">
                  <Scissors className="w-4 h-4 text-rose-600" />
                  <span>Thời gian thu hoạch</span>
                </div>
                <p className="text-stone-800 text-sm leading-relaxed font-medium">
                  {crop.thoi_gian_thu_hoach}
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
              {crop.dieu_kien_canh_tac}
            </p>
          </div>

          {/* Phương pháp canh tác truyền thống */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Hammer className="w-4 h-4 text-emerald-700" />
              Phương Pháp Canh Tác Truyền Thống
            </h4>
            <p className="text-stone-700 text-sm leading-relaxed">
              {crop.phuong_phap_canh_tac_truyen_thong}
            </p>
          </div>

          {/* Kinh nghiệm dân gian & Ca dao */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
              <Quote className="w-4 h-4 text-amber-700" />
              Kinh Nghiệm Dân Gian & Ca Dao Nông Vụ
            </h4>
            <p className="text-amber-950 font-serif italic text-sm sm:text-base leading-relaxed">
              {crop.kinh_nghiem_dan_gian}
            </p>
          </div>

          {/* Nguồn tư liệu trích dẫn */}
          <div className="flex items-start gap-2.5 text-xs text-stone-600 bg-stone-100 p-3 rounded-lg border border-stone-200">
            <BookMarked className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-700">Nguồn tư liệu đối chiếu: </span>
              <span>{crop.nguon_tu_lieu}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-100 px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
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
