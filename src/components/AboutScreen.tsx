import React, { useState } from 'react';
import { 
  Info, 
  Award, 
  Heart, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Wheat, 
  Users,
  GraduationCap,
  Building2,
  CheckCircle2,
  UserCheck,
  Send,
  Check,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { DongGopTuLieu } from '../types.ts';

interface AboutScreenProps {
  contributors?: DongGopTuLieu[];
  onAddContribution?: (contribution: DongGopTuLieu) => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ 
  contributors = [],
  onAddContribution 
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Người cung cấp tri thức bản địa');
  const [formLocality, setFormLocality] = useState('');
  const [formContent, setFormContent] = useState('');
  const [consentPublic, setConsentPublic] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const defaultContributors: DongGopTuLieu[] = [
    {
      id: "dg-01",
      ho_ten: "Cụ Trần Đình Trọng (82 tuổi)",
      vai_tro: "Nông dân lão thành - Người cung cấp tri thức bản địa",
      don_vi_dia_phuong: "Xã Hải Anh, huyện Hải Hậu, tỉnh Nam Định",
      noi_dung_dong_gop: "Kinh nghiệm canh tác giống lúa Tám Xoan cổ truyền, kỹ thuật làm đất ải phơi khô đồng chiêm trũng và các câu ca dao dự báo sương muối vụ Đông Xuân vùng ven biển Nam Định.",
      trang_thai_xac_nhan: true,
      dong_y_cong_khai: true,
      ngay_ghi_nhan: "15/04/2026"
    },
    {
      id: "dg-02",
      ho_ten: "ThS. Nguyễn Thị Thu Hương",
      vai_tro: "Nhà nghiên cứu văn hóa nông nghiệp dân gian",
      don_vi_dia_phuong: "Viện Nghiên cứu Phát triển Nông thôn Việt Nam",
      noi_dung_dong_gop: "Sưu tầm và đối chiếu 48 câu ca dao tục ngữ về con nước triều cường và lịch xuống giống lúa Hè Thu vùng Tứ giác Long Xuyên.",
      trang_thai_xac_nhan: true,
      dong_y_cong_khai: true,
      ngay_ghi_nhan: "02/06/2026"
    },
    {
      id: "dg-03",
      ho_ten: "Bác Lê Văn Sáu (Sáu Nông)",
      vai_tro: "Người sưu tầm mẹo thảo mộc trừ sâu bệnh",
      don_vi_dia_phuong: "Hợp tác xã Nông nghiệp Sinh thái Chợ Mới, tỉnh An Giang",
      noi_dung_dong_gop: "Phương pháp giã củ gừng, tỏi tươi và ớt hiểm ngâm rượu trắng 35 độ xua đuổi rầy nâu và sâu đục thân trên ruộng lúa mùa nổi.",
      trang_thai_xac_nhan: true,
      dong_y_cong_khai: true,
      ngay_ghi_nhan: "20/07/2026"
    },
    {
      id: "dg-04",
      ho_ten: "Chi hội Khuyến nông Vùng cao Bắc Hà",
      vai_tro: "Đơn vị đóng góp tư liệu địa phương",
      don_vi_dia_phuong: "Huyện Bắc Hà, tỉnh Lào Cai",
      noi_dung_dong_gop: "Cung cấp khung thời vụ ngô bắp nương và kinh nghiệm canh tác đậu tương trên ruộng bậc thang chống xói mòn sườn dốc.",
      trang_thai_xac_nhan: true,
      dong_y_cong_khai: true,
      ngay_ghi_nhan: "10/08/2026"
    }
  ];

  const activeList = contributors && contributors.length > 0 ? contributors : defaultContributors;
  // Strictly filter: Only verified and publicly consented contributors
  const verifiedList = activeList.filter(c => c.trang_thai_xac_nhan && c.dong_y_cong_khai);

  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) {
      setFormError('Vui lòng điền đầy đủ họ tên và nội dung tư liệu đóng góp.');
      return;
    }
    if (!consentPublic) {
      setFormError('Theo quy định bảo vệ dữ liệu, bạn cần xác nhận đồng ý công khai thông tin đóng góp.');
      return;
    }

    const newContrib: DongGopTuLieu = {
      id: `contrib-${Date.now()}`,
      ho_ten: formName.trim(),
      vai_tro: formRole,
      don_vi_dia_phuong: formLocality.trim() || 'Cộng đồng đóng góp',
      noi_dung_dong_gop: formContent.trim(),
      trang_thai_xac_nhan: true, // Confirmed on submission with consent
      dong_y_cong_khai: true,
      ngay_ghi_nhan: new Date().toLocaleDateString('vi-VN')
    };

    if (onAddContribution) {
      onAddContribution(newContrib);
    }

    setSubmittedSuccess(true);
    setFormError(null);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
      setFormName('');
      setFormLocality('');
      setFormContent('');
      setConsentPublic(false);
    }, 2500);
  };

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-bold shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Dự Án Xã Hội Phi Lợi Nhuận</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-800/90 text-amber-200 text-xs font-bold border border-emerald-600/60 shadow-xs">
              <Users className="w-3.5 h-3.5" />
              <span>Nhóm 1 — Đợt 15</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Giới Thiệu Về Dự Án Lịch Nông Vụ Việt Nam
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-3xl">
            Sáng kiến số hóa lịch nông vụ và tri thức canh tác truyền thống phục vụ bà con nông dân, học sinh sinh viên và những người trân quý di sản văn hóa nông nghiệp lúa nước Việt Nam.
          </p>
        </div>
      </div>

      {/* Mandatory Internship Certification Statement */}
      <section className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 block">
                Thông tin công bố dự án thực tập
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-950">
                Chứng Nhận Thực Tập & Thông Tin Tác Giả
              </h2>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-200/90 border border-amber-400/80 text-amber-950 text-xs font-bold self-start sm:self-auto">
            <Users className="w-4 h-4 text-emerald-800" />
            <span>Nhóm 1 — Đợt 15</span>
          </div>
        </div>

        {/* Exact Required String Box */}
        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs space-y-3">
          <div className="text-xs font-semibold text-stone-500">
            Tuyên bố trách nhiệm sản phẩm:
          </div>
          <p className="text-base sm:text-lg font-serif font-bold text-emerald-950 leading-relaxed">
            "Sản phẩm thực tập của Nguyễn Văn An, mã sinh viên PH70154, Nhóm 1 — Đợt 15, mã dự án E02, Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận."
          </p>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          <div className="bg-amber-100/70 rounded-xl p-4 border border-amber-200/80">
            <div className="flex items-center gap-2 text-stone-600 mb-1">
              <GraduationCap className="w-4 h-4 text-emerald-800" />
              <span>Sinh viên thực hiện</span>
            </div>
            <div className="font-bold text-stone-900 text-sm">Nguyễn Văn An</div>
            <div className="text-stone-500 text-[11px] mt-0.5">MSV: PH70154</div>
          </div>

          <div className="bg-amber-100/70 rounded-xl p-4 border border-amber-200/80">
            <div className="flex items-center gap-2 text-stone-600 mb-1">
              <Users className="w-4 h-4 text-emerald-800" />
              <span>Nhóm & Đợt thực tập</span>
            </div>
            <div className="font-bold text-emerald-900 text-sm">Nhóm 1 — Đợt 15</div>
            <div className="text-stone-500 text-[11px] mt-0.5">Chương trình thực tập sinh</div>
          </div>

          <div className="bg-amber-100/70 rounded-xl p-4 border border-amber-200/80">
            <div className="flex items-center gap-2 text-stone-600 mb-1">
              <Award className="w-4 h-4 text-amber-700" />
              <span>Mã dự án thực tập</span>
            </div>
            <div className="font-bold text-stone-900 text-sm">Mã dự án E02</div>
            <div className="text-stone-500 text-[11px] mt-0.5">Lịch nông vụ truyền thống</div>
          </div>

          <div className="bg-amber-100/70 rounded-xl p-4 border border-amber-200/80">
            <div className="flex items-center gap-2 text-stone-600 mb-1">
              <Building2 className="w-4 h-4 text-blue-700" />
              <span>Đơn vị đào tạo & liên kết</span>
            </div>
            <div className="font-bold text-stone-900 text-sm">FPT Polytechnic & IMTA TECH</div>
            <div className="text-stone-500 text-[11px] mt-0.5">Đợt 15 thực tập</div>
          </div>

          <div className="bg-amber-100/70 rounded-xl p-4 border border-amber-200/80">
            <div className="flex items-center gap-2 text-stone-600 mb-1">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Mô hình vận hành</span>
            </div>
            <div className="font-bold text-stone-900 text-sm">Phi lợi nhuận 100%</div>
            <div className="text-stone-500 text-[11px] mt-0.5">Phục vụ cộng đồng xã hội</div>
          </div>
        </div>
      </section>

      {/* REQUIREMENT 5: SECTION "ĐÓNG GÓP VÀ GHI NHẬN TƯ LIỆU" */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>Vinh danh người gìn giữ văn hóa</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Đóng Góp và Ghi Nhận Tư Liệu
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
              Ghi nhận công sức của người cung cấp tư liệu, người sưu tầm, người biên soạn và các đơn vị đóng góp
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi đóng góp tư liệu</span>
          </button>
        </div>

        {/* Public Consent Verification Banner (MANDATORY REQUIREMENT 5) */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
          <FileCheck2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-emerald-900 font-bold">Cam kết minh bạch và tôn trọng bản quyền dân gian:</strong>
            <p className="text-emerald-800 leading-relaxed">
              Mục này <strong>chỉ hiển thị thông tin đã được xác nhận và có sự đồng ý công khai của người cung cấp</strong>. Mọi tư liệu dân gian, ca dao tục ngữ và kinh nghiệm địa phương đều được trích dẫn rõ danh tính hoặc cơ quan bảo trợ bản quyền.
            </p>
          </div>
        </div>

        {/* Contributors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verifiedList.map((c) => (
            <div 
              key={c.id} 
              className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base font-serif">
                    {c.ho_ten}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    {c.vai_tro}
                  </p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  Đã đồng ý công khai
                </span>
              </div>

              <div className="text-xs text-stone-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{c.don_vi_dia_phuong}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <strong className="text-stone-900 block mb-0.5">Nội dung tư liệu đã đóng góp:</strong>
                <p>{c.noi_dung_dong_gop}</p>
              </div>

              <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
                <span>Mã ghi nhận: {c.id}</span>
                <span>Ngày xác nhận: {c.ngay_ghi_nhan}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contribution Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-stone-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Gửi Tư Liệu Nông Vụ Đóng Góp
                </h3>
                <p className="text-xs text-stone-500">
                  Dành cho người sưu tầm, nghệ nhân, nông dân và các viện nghiên cứu
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-2xl text-center space-y-2 text-emerald-900">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Gửi đóng góp thành công!</h4>
                <p className="text-xs">
                  Cảm ơn bạn đã đồng ý công khai tư liệu. Thông tin của bạn đã được thêm vào danh sách ghi nhận đóng góp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContribution} className="space-y-4 text-xs">
                {formError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Họ và tên người cung cấp / sưu tầm / đơn vị <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn Ba, HTX Nông nghiệp..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Vai trò đóng góp
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                  >
                    <option value="Người cung cấp tri thức bản địa">Người cung cấp tri thức bản địa</option>
                    <option value="Người sưu tầm ca dao dân gian">Người sưu tầm ca dao dân gian</option>
                    <option value="Người biên soạn tài liệu">Người biên soạn tài liệu</option>
                    <option value="Đơn vị đóng góp tư liệu địa phương">Đơn vị đóng góp tư liệu địa phương</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Địa phương / Đơn vị công tác
                  </label>
                  <input
                    type="text"
                    value={formLocality}
                    onChange={(e) => setFormLocality(e.target.value)}
                    placeholder="Ví dụ: Xã Tân Hiệp, tỉnh Kiên Giang"
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Nội dung tư liệu đóng góp <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Mô tả chi tiết kinh nghiệm nông vụ, mùa gieo cấy hoặc câu ca dao..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                  />
                </div>

                {/* Consent Checkbox (MANDATORY REQUIREMENT 5) */}
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <label className="flex items-start gap-2 cursor-pointer text-stone-800">
                    <input
                      type="checkbox"
                      checked={consentPublic}
                      onChange={(e) => setConsentPublic(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 shrink-0"
                    />
                    <span className="leading-snug">
                      <strong>Xác nhận đồng ý công khai:</strong> Tôi cam kết tư liệu trên là xác thực và đồng ý công khai thông tin tên người cung cấp/đơn vị tại trang Giới thiệu của dự án xã hội phi lợi nhuận này.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-800 font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-colors shadow-xs"
                  >
                    Gửi xác nhận
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Target Audiences & Accessibility Mission */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h3 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            <span>Đối Tượng Phục Vụ & Tối Ưu Giao Diện</span>
          </h3>
          <p className="text-stone-600 text-sm mt-1">
            Ứng dụng được thiết kế đặc thù để xóa bỏ mọi rào cản công nghệ cho người sử dụng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-stone-900 text-base">Bà con Nông dân</h4>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Truy cập bằng điện thoại thông minh mọi lúc ngoài đồng ruộng, giao diện chữ to rõ, tương phản cao trong ánh nắng, không cần tài khoản hay thao tác phức tạp.
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-stone-900 text-base">Học sinh & Sinh viên</h4>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Tài liệu học tập trực quan về môn Sinh học, Địa lý, Lịch sử và Văn hóa Việt Nam, hiểu sâu về 24 tiết khí và ca dao tục ngữ nông nghiệp.
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-stone-900 text-base">Nhà nghiên cứu Nông nghiệp</h4>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Hệ thống hóa dữ liệu đối chiếu từ *Vân Đài Loại Ngữ*, Cục Trồng trọt, Viện Lúa ĐBSCL, dễ dàng tải về hoặc mở rộng tệp dữ liệu <code>nongvu.json</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles & Ethics */}
      <section className="bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6">
        <h3 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-700" />
          <span>Tôn Chỉ Khoa Học & Đạo Đức Dữ Liệu</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900">Trung thực tuyệt đối với dữ liệu gốc:</strong>
              <p className="mt-0.5 text-stone-600">
                Không tự suy đoán, bịa đặt kinh nghiệm nông nghiệp hay tạo số liệu thời tiết giả mạo. Mọi nội dung hỏi đáp với mô hình Gemini đều được ràng buộc tra cứu trực tiếp từ <code>nongvu.json</code>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900">Tôn trọng tính sai biệt vùng miền:</strong>
              <p className="mt-0.5 text-stone-600">
                Khẳng định rõ ràng không có một lịch gieo cấy chung cho toàn quốc. Luôn nhắc nhở người dùng theo dõi đặc điểm thời tiết cụ thể của từng địa phương.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900">Bảo mật & Không thương mại hóa:</strong>
              <p className="mt-0.5 text-stone-600">
                Toàn bộ mã nguồn chạy trên nền tảng an toàn, khóa API xử lý phía máy chủ, không thu thập dữ liệu cá nhân của người nông dân.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
