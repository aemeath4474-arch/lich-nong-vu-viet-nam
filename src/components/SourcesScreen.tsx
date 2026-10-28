import React, { useState } from 'react';
import { NongVuDatabase, NongVuRecord } from '../types.ts';
import { 
  Library, 
  BookMarked, 
  Download, 
  PlusCircle, 
  FileCode, 
  Check, 
  Copy, 
  ExternalLink,
  Sparkles,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface SourcesScreenProps {
  data: NongVuDatabase;
  onRecordAdded?: (newRecord: NongVuRecord) => void;
}

export const SourcesScreen: React.FC<SourcesScreenProps> = ({ data, onRecordAdded }) => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form state for adding custom crop record into the empty structure
  const [formData, setFormData] = useState<NongVuRecord>({
    ten_cay_trong: '',
    ten_goi_khac: '',
    nhom_cay: 'Cây lương thực',
    khu_vuc_ap_dung: '',
    mua_vu: '',
    thoi_gian_gieo_trong: '',
    thoi_gian_cham_soc: '',
    thoi_gian_thu_hoach: '',
    dieu_kien_canh_tac: '',
    phuong_phap_canh_tac_truyen_thong: '',
    kinh_nghiem_dan_gian: '',
    nguon_tu_lieu: '',
  });

  const emptyTemplateString = JSON.stringify(data.cau_truc_mau_rong, null, 2);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(emptyTemplateString);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleDownloadJson = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ten_cay_trong.trim()) {
      setSubmitError('Vui lòng nhập tên cây trồng.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/nongvu/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Không thể lưu bản ghi mới');
      }

      const result = await res.json();
      setSubmitSuccess(true);
      if (onRecordAdded && result.record) {
        onRecordAdded(result.record);
      }

      // Reset form
      setFormData({
        ten_cay_trong: '',
        ten_goi_khac: '',
        nhom_cay: 'Cây lương thực',
        khu_vuc_ap_dung: '',
        mua_vu: '',
        thoi_gian_gieo_trong: '',
        thoi_gian_cham_soc: '',
        thoi_gian_thu_hoach: '',
        dieu_kien_canh_tac: '',
        phuong_phap_canh_tac_truyen_thong: '',
        kinh_nghiem_dan_gian: '',
        nguon_tu_lieu: '',
      });

      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      setSubmitError(err.message || 'Lỗi khi bổ sung dữ liệu vào tệp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* Title & Introduction */}
      <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-semibold">
            <Library className="w-3.5 h-3.5" />
            <span>Nguồn Dữ Liệu Nông Nghiệp Khách Quan & Chính Thống</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Nguồn Tư Liệu & Cơ Sở Dữ Liệu Nông Vụ
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Danh mục tài liệu kinh điển, công trình nghiên cứu khoa học và văn hóa dân gian được ứng dụng sử dụng để đối chiếu, đồng thời hỗ trợ xuất/nhập và bổ sung dữ liệu thực tế vào tệp <strong>nongvu.json</strong>.
          </p>
        </div>
      </div>

      {/* Part 1: Official Reference Bibliography */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-emerald-700" />
            <span>Danh Mục Tài Liệu Tham Khảo Chính Thức</span>
          </h2>
          <p className="text-stone-600 text-sm mt-0.5">
            Các tác phẩm thư tịch cổ và tài liệu chỉ đạo chuyên môn của các viện nghiên cứu nông nghiệp quốc gia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.tai_lieu_tham_khao.map((tl) => (
            <div 
              key={tl.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-emerald-500/80 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {tl.loai_tai_lieu}
                  </span>
                  <span className="text-stone-400 font-mono">{tl.nam_xuat_ban}</span>
                </div>

                <h3 className="text-lg font-serif font-bold text-stone-900">
                  {tl.ten_tai_lieu}
                </h3>
                <p className="text-xs font-semibold text-amber-800">
                  Tác giả / Cơ quan biên soạn: {tl.tac_gia}
                </p>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed pt-1">
                  {tl.mo_ta}
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs text-stone-700">
                <strong className="text-stone-900 block mb-0.5">Giá trị khoa học & lịch sử:</strong>
                <p>{tl.gia_tri}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Part 2: JSON Database Structure & Downloads (Empty Template Available) */}
      <section className="bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <FileCode className="w-4 h-4" />
              <span>Cấu trúc tệp dữ liệu nongvu.json</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
              Cấu Trúc Dữ Liệu Rỗng Để Bổ Sung Thực Tế
            </h3>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl">
              Hệ thống cung cấp sẵn mẫu bản ghi rỗng gồm đúng 11 trường thông tin chuẩn mực để bạn có thể tự sao chép hoặc bổ sung dữ liệu địa phương vào tệp <code>nongvu.json</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyTemplate}
              className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:border-emerald-600 text-stone-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {copiedTemplate ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedTemplate ? 'Đã sao chép mẫu' : 'Sao chép mẫu rỗng'}</span>
            </button>

            <button
              onClick={() => handleDownloadJson(emptyTemplateString, 'cau_truc_nongvu_mau_rong.json')}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Tải mẫu rỗng (.json)</span>
            </button>

            <button
              onClick={() => handleDownloadJson(JSON.stringify(data, null, 2), 'nongvu.json')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Tải toàn bộ nongvu.json</span>
            </button>
          </div>
        </div>

        {/* Code Preview of Empty Structure */}
        <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 font-mono text-xs overflow-x-auto shadow-inner relative">
          <div className="flex items-center justify-between text-stone-400 pb-3 mb-3 border-b border-stone-800">
            <span>cau_truc_mau_rong (11 trường chuẩn hoá)</span>
            <span className="text-[10px] text-amber-400">UTF-8 JSON</span>
          </div>
          <pre>{emptyTemplateString}</pre>
        </div>
      </section>

      {/* Part 3: Form To Add Real Data Directly */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-emerald-700" />
              <span>Biểu Mẫu Nhập Liệu Bổ Sung Thực Tế</span>
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
              Bạn có thể tự tay nhập thêm dữ liệu cây trồng hoặc mùa vụ thực tế của địa phương vào hệ thống
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            {showAddForm ? 'Thu gọn biểu mẫu' : 'Mở biểu mẫu nhập liệu'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleFormSubmit} className="space-y-5 pt-4 border-t border-stone-100">
            {submitSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Bổ sung bản ghi thành công vào tệp <strong>nongvu.json</strong>! Bạn có thể tra cứu ngay ở màn hình Lịch Nông Vụ và Hỏi Đáp Gemini.</span>
              </div>
            )}

            {submitError && (
              <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  1. Tên cây trồng <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Khoai sọ Thuận Thành"
                  value={formData.ten_cay_trong}
                  onChange={(e) => setFormData({ ...formData, ten_cay_trong: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  2. Tên gọi khác
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Môn nước, khoai sọ nếp"
                  value={formData.ten_goi_khac}
                  onChange={(e) => setFormData({ ...formData, ten_goi_khac: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nhóm cây trồng
                </label>
                <select
                  value={formData.nhom_cay}
                  onChange={(e) => setFormData({ ...formData, nhom_cay: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:ring-2 focus:ring-emerald-700 outline-none"
                >
                  <option value="Cây lương thực">Cây lương thực</option>
                  <option value="Cây hoa màu & củ">Cây hoa màu & củ</option>
                  <option value="Cây họ đậu">Cây họ đậu</option>
                  <option value="Rau ăn lá & quả">Rau ăn lá & quả</option>
                  <option value="Cây công nghiệp & ăn quả">Cây công nghiệp & ăn quả</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  3. Khu vực áp dụng
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bắc Ninh, Đồng bằng sông Hồng"
                  value={formData.khu_vuc_ap_dung}
                  onChange={(e) => setFormData({ ...formData, khu_vuc_ap_dung: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  4. Mùa vụ
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Vụ Thu Đông (tháng 8 - 12 DL)"
                  value={formData.mua_vu}
                  onChange={(e) => setFormData({ ...formData, mua_vu: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  5. Thời gian gieo trồng
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Gieo mầm tháng 8 âm lịch"
                  value={formData.thoi_gian_gieo_trong}
                  onChange={(e) => setFormData({ ...formData, thoi_gian_gieo_trong: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  6. Thời gian chăm sóc
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Vun xới làm cỏ đợt 1 sau 20 ngày"
                  value={formData.thoi_gian_cham_soc}
                  onChange={(e) => setFormData({ ...formData, thoi_gian_cham_soc: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  7. Thời gian thu hoạch
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thu hoạch tháng 12 âm lịch"
                  value={formData.thoi_gian_thu_hoach}
                  onChange={(e) => setFormData({ ...formData, thoi_gian_thu_hoach: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  8. Nguồn tư liệu
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kinh nghiệm gia đình nông hộ; Khuyến nông"
                  value={formData.nguon_tu_lieu}
                  onChange={(e) => setFormData({ ...formData, nguon_tu_lieu: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  9. Điều kiện canh tác & thời tiết phù hợp
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả đất đai, độ ẩm, nhiệt độ phù hợp..."
                  value={formData.dieu_kien_canh_tac}
                  onChange={(e) => setFormData({ ...formData, dieu_kien_canh_tac: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  10. Phương pháp canh tác truyền thống
                </label>
                <textarea
                  rows={2}
                  placeholder="Kỹ thuật làm đất ải, bón lót phân chuồng, tro bếp, phòng trừ sâu bệnh..."
                  value={formData.phuong_phap_canh_tac_truyen_thong}
                  onChange={(e) => setFormData({ ...formData, phuong_phap_canh_tac_truyen_thong: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  11. Kinh nghiệm dân gian & Ca dao (nếu có)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ câu ca dao, mẹo dân gian truyền khẩu..."
                  value={formData.kinh_nghiem_dan_gian}
                  onChange={(e) => setFormData({ ...formData, kinh_nghiem_dan_gian: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {isSubmitting ? 'Đang lưu bản ghi...' : 'Lưu bản ghi vào nongvu.json'}
              </button>
            </div>
          </form>
        )}
      </section>

    </div>
  );
};
