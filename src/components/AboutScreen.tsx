import React from 'react';
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
  CheckCircle2
} from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      
      {/* Hero Banner with Official Internship Statement */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-bold shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Dự Án Xã Hội Phi Lợi Nhuận</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Giới Thiệu Về Dự Án Lịch Nông Vụ Việt Nam
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-3xl">
            Sáng kiến số hóa lịch nông vụ và tri thức canh tác truyền thống phục vụ bà con nông dân, học sinh sinh viên và những người trân quý di sản văn hóa nông nghiệp lúa nước Việt Nam.
          </p>
        </div>
      </div>

      {/* MANDATORY PROJECT & INTERNSHIP BADGE CARD */}
      <section className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              Thông tin công bố dự án thực tập
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-950">
              Chứng Nhận Thực Tập & Thông Tin Tác Giả
            </h2>
          </div>
        </div>

        {/* Exact Required String Box */}
        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs space-y-3">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Tuyên bố trách nhiệm sản phẩm:
          </div>
          <p className="text-base sm:text-lg font-serif font-bold text-emerald-950 leading-relaxed">
            "Sản phẩm thực tập của Nguyễn Văn An, mã sinh viên PH70154, mã dự án E02, Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận."
          </p>
        </div>

        {/* Breakdown Grid for Transparency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
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
            <div className="text-stone-500 text-[11px] mt-0.5">Thực tập sinh Đợt 15</div>
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
