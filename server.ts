import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());

// Load nongvu.json database
const getNongVuData = () => {
  try {
    const raw = fs.readFileSync(path.resolve(__dirname, 'nongvu.json'), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading nongvu.json:', err);
    return null;
  }
};

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Local Grounded Search Engine over nongvu.json
function searchLocalNongVu(question: string, nongVuData: any) {
  const qLower = question.toLowerCase();

  // Check for real-time weather question to enforce mandatory limitation notice
  const isRealTimeWeather = 
    qLower.includes('hôm nay') || 
    qLower.includes('thời tiết') || 
    qLower.includes('nhiệt độ') || 
    qLower.includes('dự báo') || 
    qLower.includes('ngày mai');

  // Match crop records by tokens, keywords, seasons, and aliases
  const matchedRecord = nongVuData.danh_sach_nong_vu.find((rec: any) => {
    const nameLower = rec.ten_cay_trong.toLowerCase();
    const aliasLower = (rec.ten_goi_khac || '').toLowerCase();
    const seasonLower = rec.mua_vu.toLowerCase();

    // Check direct substring
    if (qLower.includes(nameLower) || nameLower.includes(qLower)) return true;
    if (aliasLower && (qLower.includes(aliasLower) || aliasLower.includes(qLower))) return true;

    // Check specific popular keywords
    if (qLower.includes('chiêm xuân') && (nameLower.includes('chiêm') || seasonLower.includes('chiêm'))) return true;
    if (qLower.includes('hè thu') && (nameLower.includes('hè thu') || seasonLower.includes('hè thu'))) return true;
    if (qLower.includes('vụ mùa') && (nameLower.includes('vụ mùa') || seasonLower.includes('vụ mùa'))) return true;
    if (qLower.includes('lúa') && (nameLower.includes('lúa'))) {
      if (qLower.includes('bắc') && rec.khu_vuc_ap_dung.toLowerCase().includes('bắc')) return true;
      if (qLower.includes('nam') && rec.khu_vuc_ap_dung.toLowerCase().includes('nam')) return true;
      return true;
    }
    if (qLower.includes('ngô') || qLower.includes('bắp')) return nameLower.includes('ngô') || aliasLower.includes('bắp');
    if (qLower.includes('khoai lang') || qLower.includes('khoai')) return nameLower.includes('khoai');
    if (qLower.includes('lạc') || qLower.includes('đậu phộng')) return nameLower.includes('lạc') || aliasLower.includes('đậu phộng');
    if (qLower.includes('đậu xanh') || qLower.includes('đỗ xanh')) return nameLower.includes('đậu xanh') || aliasLower.includes('đỗ xanh');
    if (qLower.includes('rau muống')) return nameLower.includes('rau muống');
    if (qLower.includes('cà chua')) return nameLower.includes('cà chua');
    if (qLower.includes('bưởi')) return nameLower.includes('bưởi');
    if (qLower.includes('chè') || qLower.includes('trà')) return nameLower.includes('chè');
    if (qLower.includes('cà phê')) return nameLower.includes('cà phê');

    return false;
  });

  // Match traditional knowledge
  const matchedTriThuc = nongVuData.tri_thuc_canh_tac.find((item: any) =>
    qLower.includes(item.chu_de.toLowerCase().slice(0, 10)) ||
    qLower.includes('sâu') || 
    qLower.includes('rầy') || 
    qLower.includes('tro bếp') || 
    qLower.includes('đất ải') || 
    qLower.includes('nhất nước') ||
    item.chu_de.toLowerCase().includes(qLower) ||
    item.chi_tiet.toLowerCase().includes(qLower)
  );

  // Match solar term
  const matchedTietKhi = nongVuData.tiet_khi_24.find((t: any) =>
    qLower.includes(t.ten.toLowerCase())
  );

  if (matchedRecord) {
    return {
      topic: matchedRecord.ten_cay_trong,
      region: matchedRecord.khu_vuc_ap_dung,
      source: matchedRecord.nguon_tu_lieu,
      answer: `Theo tư liệu canh tác truyền thống đối chiếu từ tệp nongvu.json:
- Mùa vụ: ${matchedRecord.mua_vu}
- Thời gian gieo trồng: ${matchedRecord.thoi_gian_gieo_trong}
- Thời gian chăm sóc: ${matchedRecord.thoi_gian_cham_soc}
- Thời gian thu hoạch: ${matchedRecord.thoi_gian_thu_hoach}
- Điều kiện canh tác: ${matchedRecord.dieu_kien_canh_tac}
- Phương pháp canh tác truyền thống: ${matchedRecord.phuong_phap_canh_tac_truyen_thong}
- Kinh nghiệm dân gian: ${matchedRecord.kinh_nghiem_dan_gian}`,
      limitationNotice: isRealTimeWeather
        ? "Cảnh báo giới hạn thông tin: Hệ thống lưu trữ lịch nông vụ và tri thức truyền thống theo mùa vụ, không có dữ liệu thời tiết và nhiệt độ thời gian thực. Bà con cần theo dõi thực tế tại địa phương."
        : "Lưu ý quan trọng: Thời vụ gieo trồng có thể chênh lệch giữa các tiểu vùng khí hậu. Không áp dụng cùng một khung lịch cho mọi địa phương.",
      foundInDatabase: true,
    };
  }

  if (matchedTriThuc) {
    return {
      topic: matchedTriThuc.chu_de,
      region: "Áp dụng theo kinh nghiệm dân gian các vùng canh tác",
      source: matchedTriThuc.nguon_tu_lieu,
      answer: `${matchedTriThuc.chi_tiet}

Kinh nghiệm ca dao truyền khẩu: "${matchedTriThuc.ca_dao_tuc_ngu}"`,
      limitationNotice: isRealTimeWeather
        ? "Cảnh báo giới hạn thông tin: Hệ thống không cung cấp dự báo thời tiết thời gian thực."
        : "Kinh nghiệm cổ truyền cần được vận dụng linh hoạt phù hợp với thực tế đất đai của từng nông hộ.",
      foundInDatabase: true,
    };
  }

  if (matchedTietKhi) {
    return {
      topic: `Tiết ${matchedTietKhi.ten}`,
      region: "Cả nước (theo lịch thiên văn nông nghiệp truyền thống)",
      source: "24 Tiết khí Nông vụ Việt Nam",
      answer: `Tiết ${matchedTietKhi.ten} (${matchedTietKhi.thoi_gian}):
Ý nghĩa nông vụ: ${matchedTietKhi.y_nghia_nong_vu}`,
      limitationNotice: isRealTimeWeather
        ? "Hệ thống chỉ cung cấp khung tiết khí nông nghiệp lý thuyết, không thay thế dự báo khí tượng thời gian thực."
        : null,
      foundInDatabase: true,
    };
  }

  // Not found in database
  return {
    topic: "Chưa có tư liệu trong hệ thống",
    region: "Không xác định",
    source: "Tệp nongvu.json",
    answer: "Hiện tại hệ thống chưa có tư liệu về nội dung này trong tệp dữ liệu nongvu.json. Tuân thủ tôn chỉ đạo đức dữ liệu, hệ thống tuyệt đối không tự suy đoán hoặc bịa đặt tri thức canh tác chưa được kiểm chứng.",
    limitationNotice: isRealTimeWeather
      ? "Hệ thống không lưu trữ dữ liệu thời tiết thực tế theo thời gian thực."
      : "Bạn có thể sử dụng màn hình 'Nguồn tư liệu' để bổ sung dữ liệu thực tế vào tệp nongvu.json.",
    foundInDatabase: false,
  };
}

// Endpoint: GET /api/nongvu
app.get('/api/nongvu', (req, res) => {
  const data = getNongVuData();
  if (!data) {
    return res.status(500).json({ error: 'Không thể đọc tệp dữ liệu nongvu.json' });
  }
  res.json(data);
});

// Endpoint: POST /api/nongvu/add
app.post('/api/nongvu/add', (req, res) => {
  try {
    const newRecord = req.body;
    if (!newRecord || !newRecord.ten_cay_trong) {
      return res.status(400).json({ error: 'Vui lòng cung cấp ít nhất tên cây trồng.' });
    }

    const data = getNongVuData();
    if (!data) {
      return res.status(500).json({ error: 'Không thể tải dữ liệu.' });
    }

    const recordWithId = {
      id: `custom-${Date.now()}`,
      nhom_cay: newRecord.nhom_cay || 'Khác',
      ...newRecord,
    };

    data.danh_sach_nong_vu.unshift(recordWithId);
    fs.writeFileSync(path.resolve(__dirname, 'nongvu.json'), JSON.stringify(data, null, 2), 'utf-8');

    res.json({ success: true, record: recordWithId });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Lỗi khi lưu dữ liệu mới.' });
  }
});

// Endpoint: POST /api/ask
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập câu hỏi của bạn.' });
    }

    const nongVuData = getNongVuData();
    if (!nongVuData) {
      return res.status(500).json({ error: 'Tệp dữ liệu nongvu.json chưa sẵn sàng.' });
    }

    const client = getGeminiClient();

    // If no client, or if client fails/times out, use local grounded search
    if (!client) {
      const fallbackResult = searchLocalNongVu(question, nongVuData);
      return res.json(fallbackResult);
    }

    // Prepare ground truth context from nongvu.json
    const recordsSummary = nongVuData.danh_sach_nong_vu.map((item: any, idx: number) => {
      return `[Bản ghi ${idx + 1}]
- Tên cây trồng: ${item.ten_cay_trong}
- Tên gọi khác: ${item.ten_goi_khac || 'Không có'}
- Khu vực áp dụng: ${item.khu_vuc_ap_dung}
- Mùa vụ: ${item.mua_vu}
- Thời gian gieo trồng: ${item.thoi_gian_gieo_trong}
- Thời gian chăm sóc: ${item.thoi_gian_cham_soc}
- Thời gian thu hoạch: ${item.thoi_gian_thu_hoach}
- Điều kiện canh tác: ${item.dieu_kien_canh_tac}
- Phương pháp canh tác truyền thống: ${item.phuong_phap_canh_tac_truyen_thong}
- Kinh nghiệm dân gian: ${item.kinh_nghiem_dan_gian}
- Nguồn tư liệu: ${item.nguon_tu_lieu}`;
    }).join('\n\n');

    const triThucSummary = (nongVuData.tri_thuc_canh_tac || []).map((item: any) => {
      return `[Tri thức: ${item.chu_de} (${item.phan_loai})]
- Chi tiết: ${item.chi_tiet}
- Ca dao tục ngữ: ${item.ca_dao_tuc_ngu}
- Nguồn tư liệu: ${item.nguon_tu_lieu}`;
    }).join('\n\n');

    const tietKhiSummary = (nongVuData.tiet_khi_24 || []).map((t: any) => `${t.ten} (${t.thoi_gian}): ${t.y_nghia_nong_vu}`).join('\n');

    const promptContext = `Bạn là Trợ lý Tri Thức Nông Vụ & Lịch Nông Nghiệp Truyền Thống Việt Nam.
Dưới đây là TOÀN BỘ dữ liệu chính thức được lưu trong tệp "nongvu.json":

=== DANH SÁCH LỊCH NÔNG VỤ & CÂY TRỒNG ===
${recordsSummary}

=== KHO TÀNG TRI THỨC CANH TÁC TRUYỀN THỐNG ===
${triThucSummary}

=== 24 TIẾT KHÍ NÔNG VỤ ===
${tietKhiSummary}

=== CÁC RÀNG BUỘC BẮT BUỘC ===
1. Tuyệt đối không tự suy đoán hoặc bịa đặt thông tin về lịch nông vụ, kinh nghiệm dân gian hay phương pháp canh tác.
2. Nếu không tìm thấy thông tin trong dữ liệu trên thì phải trả lời rõ rằng: "Hiện tại hệ thống chưa có tư liệu về nội dung này trong tệp dữ liệu nongvu.json."
3. Không khẳng định một lịch gieo trồng áp dụng cho mọi địa phương vì thời vụ có thể khác nhau theo vùng miền, khí hậu và điều kiện sản xuất. Phải nêu rõ tính vùng miền.
4. Không tự tạo số liệu thời tiết, năng suất hoặc thông tin khoa học chưa được kiểm chứng.
5. Nếu câu hỏi liên quan đến thời vụ hiện tại (ví dụ: "Hôm nay tôi nên trồng cây gì?", "Thời tiết hiện tại ở Hà Nội thế nào?") hoặc điều kiện thời tiết thực tế mà dữ liệu không cung cấp, hệ thống BẮT BUỘC phải thông báo rõ giới hạn thông tin: hệ thống chỉ lưu trữ tri thức lịch nông vụ truyền thống và khung thời vụ theo mùa vụ, không có dữ liệu khí tượng thời gian thực.
6. Mỗi câu trả lời cần ghi rõ:
   - Tên cây trồng hoặc chủ đề liên quan
   - Khu vực áp dụng (nếu có)
   - Nguồn tư liệu được sử dụng
   - Nội dung trả lời chi tiết, chuẩn xác dựa trên dữ liệu.

Trả về kết quả dưới định dạng JSON duy nhất:
{
  "topic": "Tên cây trồng hoặc chủ đề liên quan",
  "region": "Khu vực áp dụng (hoặc cảnh báo tính vùng miền)",
  "source": "Nguồn tư liệu trích dẫn",
  "answer": "Nội dung trả lời chi tiết và chuẩn xác dựa trên dữ liệu",
  "limitationNotice": "Ghi chú giới hạn thông tin nếu hỏi về thời tiết thời gian thực hoặc thông tin ngoài dữ liệu (hoặc null nếu không có)",
  "foundInDatabase": true hoặc false
}

Câu hỏi của người dùng: "${question}"`;

    try {
      // Call Gemini API with 8s timeout
      const generatePromise = client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction: 'Bạn là chuyên gia nông nghiệp Việt Nam, tuyệt đối trung thực với dữ liệu nongvu.json. Không bao giờ suy đoán ngoài dữ liệu.',
        },
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API timeout')), 8000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text || '';
      
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedResult = JSON.parse(cleaned);
      return res.json(parsedResult);
    } catch (geminiError: any) {
      console.warn('Gemini call failed or timed out, using grounded search fallback:', geminiError.message);
      const fallbackResult = searchLocalNongVu(question, nongVuData);
      return res.json(fallbackResult);
    }
  } catch (error: any) {
    console.error('Error in /api/ask:', error);
    return res.status(500).json({
      error: error.message || 'Có lỗi xảy ra khi xử lý câu hỏi.',
    });
  }
});

// Configure Vite middleware in development or static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
