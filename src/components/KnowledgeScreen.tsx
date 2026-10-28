import React, { useState } from 'react';
import { NongVuDatabase, TriThuc } from '../types.ts';
import { 
  BookOpen, 
  Sparkles, 
  Quote, 
  ShieldCheck, 
  Search, 
  Sun, 
  Droplet, 
  Bug, 
  Shovel, 
  BookMarked,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface KnowledgeScreenProps {
  data: NongVuDatabase;
  onAskQuestion: (query: string) => void;
}

export const KnowledgeScreen: React.FC<KnowledgeScreenProps> = ({ data, onAskQuestion }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTriThuc, setSelectedTriThuc] = useState<TriThuc | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả tri thức', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Làm đất & Dinh dưỡng', label: 'Làm đất & Đất ải', icon: <Shovel className="w-4 h-4" /> },
    { id: 'Bảo vệ thực vật truyền thống', label: 'Trừ sâu bệnh tự nhiên', icon: <Bug className="w-4 h-4" /> },
    { id: 'Tưới tiêu & Quản lý vụ mùa', label: 'Điều tiết nước & Phân bón', icon: <Droplet className="w-4 h-4" /> },
    { id: 'Hệ thống canh tác', label: 'Luân canh & Xen canh', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const filteredTriThuc = data.tri_thuc_canh_tac.filter(item => {
    const matchCat = activeCategory === 'all' || item.phan_loai === activeCategory;
    const matchSearch = 
      item.chu_de.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chi_tiet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ca_dao_tuc_ngu.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const caDaoList = [
    {
      cau: "Lúa chiêm lấp ló đầu bờ, hễ nghe tiếng sấm phất cờ mà lên.",
      y_nghia: "Tia sét và tiếng sấm đầu mùa hạ kích hoạt phản ứng hóa học tự nhiên biến khí nitơ trong khí quyển thành ion amoni và nitrat theo nước mưa tưới xuống ruộng, cung cấp phân đạm tự nhiên miễn phí giúp lúa vươn cao mạnh mẽ.",
      linh_vuc: "Dinh dưỡng cây lúa"
    },
    {
      cau: "Một hòn đất nỏ bằng một giỏ phân.",
      y_nghia: "Phơi ải đất ruộng trong mùa khô hanh giúp oxy hóa các chất độc hữu cơ, diệt nấm bệnh và giải phóng các chất khoáng khó tiêu trong đất, giá trị bổ dưỡng đất ngang bằng một giỏ phân bón.",
      linh_vuc: "Kỹ thuật làm đất"
    },
    {
      cau: "Nhất nước, nhì phân, tam cần, tứ giống.",
      y_nghia: "Quy luật cốt lõi trong nông nghiệp lúa nước: Nguồn nước đứng hàng đầu, thứ nhì là phân bón, thứ ba là sự chuyên cần chăm sóc dặm tỉa, thứ tư là việc chọn lọc bảo quản giống.",
      linh_vuc: "Nguyên lý tổng thể"
    },
    {
      cau: "Khoai ruộng lạ, mạ ruộng quen.",
      y_nghia: "Khoai lang cần luân canh đất mới để củ to không bị sùng sâu bệnh hại cắn phá rễ củ; còn mạ lúa non thì gieo trên đất ruộng quen thuộc đã ủ bùn nhuyễn và sạch cỏ dại.",
      linh_vuc: "Luân canh cây màu"
    },
    {
      cau: "Bao giờ đom đóm bay ra, hoa gạo rụng xuống thì tra hạt vừng.",
      y_nghia: "Dấu hiệu đồng hồ sinh học tự nhiên: Khi đom đóm bay và hoa gạo rụng (cuối tháng 3 âm lịch) báo hiệu đất đã ấm hẳn, hết gió rét nàng Bân, đất ẩm lý tưởng để tra hạt mè (vừng) nảy mầm đều.",
      linh_vuc: "Thiên văn & Sinh học"
    },
    {
      cau: "Được mùa lúa úa mùa cau, được mùa cau đau mùa lúa.",
      y_nghia: "Quy luật tương tác thời tiết: Năm nào mưa gió thuận hòa nhiều nước thì lúa trĩu hạt được mùa, nhưng cau lại dễ rụng hoa; ngược lại năm hạn nắng ráo cau đậu buồng sai nhưng lúa lại thiếu nước.",
      linh_vuc: "Quan sát khí hậu"
    }
  ];

  return (
    <div className="space-y-10 pb-12">
      
      {/* Title & Introduction */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kinh nghiệm dân gian ngàn năm đúc kết</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Tri Thức Canh Tác Cổ Truyền Việt Nam
          </h1>
          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Hệ thống tri thức bản địa phong phú về kỹ thuật làm đất ải, cách ủ phân hoai mục, kỹ thuật bảo vệ mùa màng bằng thảo mộc tự nhiên và các câu ca dao tục ngữ được kiểm chứng qua bao thế hệ nhà nông Việt Nam.
          </p>
        </div>
      </div>

      {/* Category Nav & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === c.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tri thức, mẹo..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Main Knowledge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTriThuc.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-amber-600/70 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {item.phan_loai}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  {item.id}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug">
                  {item.chu_de}
                </h3>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  {item.tom_tat}
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
                <p>{item.chi_tiet}</p>
              </div>

              {/* Ca dao tục ngữ */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-3 rounded-r-xl">
                <div className="text-[11px] font-bold text-amber-900 uppercase flex items-center gap-1.5 mb-1">
                  <Quote className="w-3.5 h-3.5" />
                  <span>Kinh nghiệm truyền khẩu dân gian</span>
                </div>
                <div className="font-serif italic text-amber-950 text-sm">
                  "{item.ca_dao_tuc_ngu}"
                </div>
              </div>
            </div>

            <div className="bg-stone-100/80 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-1.5 truncate">
                <BookMarked className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">Nguồn: {item.nguon_tu_lieu}</span>
              </div>
              <button
                onClick={() => onAskQuestion(`Hỏi thêm về: ${item.chu_de}`)}
                className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs shrink-0 flex items-center gap-1"
              >
                Hỏi AI chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 24 Tiết Khí Nông Vụ Full Reference */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Chi Tiết 24 Tiết Khí Nông Nghiệp Truyền Thống
            </h2>
            <p className="text-stone-600 text-sm">
              Mỗi tiết khí kéo dài khoảng 15 ngày, thể hiện sự vận động của mặt trời và thời tiết ảnh hưởng trực tiếp đến cây trồng.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.tiet_khi_24.map((tiet, idx) => (
            <div 
              key={tiet.ten}
              className="bg-stone-50 hover:bg-emerald-50/50 rounded-xl p-4 border border-stone-200 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400">#{idx + 1}</span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {tiet.thoi_gian}
                </span>
              </div>
              <h4 className="text-base font-bold text-emerald-950 font-serif">
                Tiết {tiet.ten}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {tiet.y_nghia_nong_vu}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tuyển Tập Ca Dao Tục Ngữ Nông Nghiệp Giải Thích Khoa Học Dân Gian */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-amber-300">
              Ca Dao Tục Ngữ & Giải Thích Khoa Học Dân Gian
            </h2>
            <p className="text-stone-300 text-sm">
              Những đúc kết ngàn năm qua lăng kính tri thức bản địa chính xác đáng kinh ngạc
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caDaoList.map((item, idx) => (
            <div 
              key={idx}
              className="bg-stone-800/80 rounded-2xl p-5 border border-stone-700 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>{item.linh_vuc}</span>
                <span className="text-stone-500">Kinh nghiệm cổ truyền</span>
              </div>
              <p className="font-serif italic text-base text-amber-200 font-medium">
                "{item.cau}"
              </p>
              <p className="text-xs text-stone-300 leading-relaxed pt-2 border-t border-stone-700/60">
                <strong>Ý nghĩa thực tế:</strong> {item.y_nghia}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
