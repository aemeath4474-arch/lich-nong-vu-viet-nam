import React, { useState, useEffect } from 'react';
import { GeminiAnswer } from '../types.ts';
import { 
  HelpCircle, 
  Send, 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  BookMarked, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  History, 
  Info,
  Wheat,
  RotateCcw
} from 'lucide-react';

interface QAScreenProps {
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export const QAScreen: React.FC<QAScreenProps> = ({ 
  initialQuestion = '', 
  onClearInitialQuestion 
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeminiAnswer | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: GeminiAnswer; time: string }[]>([]);

  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
      handleAskQuestion(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  const sampleQuestions = [
    {
      label: "Thời vụ lúa Chiêm Xuân miền Bắc",
      query: "Thời gian gieo cấy lúa vụ Chiêm Xuân ở miền Bắc là khi nào và cần chú ý điều gì về sương rét?"
    },
    {
      label: "Trừ sâu rầy bằng thảo mộc",
      query: "Phương pháp phòng trừ rầy và sâu bọ bằng thảo mộc tự nhiên theo kinh nghiệm dân gian?"
    },
    {
      label: "Thời vụ gieo củ lạc (đậu phộng)",
      query: "Khung thời vụ gieo trồng lạc (đậu phộng) ở vùng Bắc Trung Bộ và kỹ thuật bón vôi?"
    },
    {
      label: "Thử giới hạn thời tiết thực tế",
      query: "Hôm nay nhiệt độ ở Hà Nội thế nào và tôi có thể xuống giống rau muống được không?"
    },
    {
      label: "Kỹ thuật làm đất ải truyền thống",
      query: "Kỹ thuật làm đất ải và làm ngấu bùn ruộng lúa có ý nghĩa khoa học và thực tế như thế nào?"
    }
  ];

  const handleAskQuestion = async (textToAsk?: string) => {
    const q = textToAsk || question;
    if (!q.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Lỗi máy chủ: ${res.status}`);
      }

      const data: GeminiAnswer = await res.json();
      setCurrentResult(data);

      // Add to session history
      setHistory(prev => [
        { 
          q, 
          a: data, 
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) 
        }, 
        ...prev.slice(0, 9)
      ]);
    } catch (err: any) {
      console.error('Ask error:', err);
      setErrorMessage(
        err.message || 'Không thể kết nối đến máy chủ xử lý Gemini. Vui lòng kiểm tra lại kết nối mạng.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentResult) return;
    const textToCopy = `Chủ đề: ${currentResult.topic}
Khu vực áp dụng: ${currentResult.region}
Nguồn tư liệu: ${currentResult.source}
Nội dung: ${currentResult.answer}
${currentResult.limitationNotice ? `Lưu ý: ${currentResult.limitationNotice}` : ''}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!currentResult) return;

    const utterance = new SpeechSynthesisUtterance(
      `${currentResult.topic}. ${currentResult.answer}. ${currentResult.limitationNotice || ''}`
    );
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title & Prompting Guidelines Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/70 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trợ lý Đối chiếu Dữ liệu Nông vụ Gemini</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Hỏi Đáp Mùa Vụ & Kỹ Thuật Canh Tác
          </h1>
          <p className="text-emerald-100/90 text-sm leading-relaxed">
            Hệ thống sử dụng mô hình Gemini API để phân tích câu hỏi của bạn, tra cứu chính xác trong tệp dữ liệu <strong>nongvu.json</strong> và đưa ra câu trả lời trung thực, ghi rõ nguồn tư liệu và khu vực áp dụng.
          </p>
        </div>
      </div>

      {/* Mandatory Grounding & Ethics Compliance Bar */}
      <div className="bg-stone-100 border border-stone-200 rounded-2xl p-4 text-xs text-stone-700 space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-900">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Quy tắc ứng xử và bảo vệ tính trung thực của dữ liệu:</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-600 pl-6 list-disc">
          <li>Tuyệt đối <strong>không suy đoán</strong> hoặc bịa đặt tri thức nông vụ khi không có trong dữ liệu.</li>
          <li>Ghi rõ tên cây trồng/chủ đề, khu vực áp dụng và nguồn tư liệu đối chứng.</li>
          <li>Không khẳng định một lịch gieo cấy áp dụng chung cho mọi nơi (phải xét tính vùng miền).</li>
          <li>Thông báo rõ ràng giới hạn thông tin nếu hỏi về thời tiết thời gian thực ngoài phạm vi dữ liệu.</li>
        </ul>
      </div>

      {/* Main Input Box */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <label className="block text-sm font-bold text-stone-800">
          Nhập câu hỏi của bạn về mùa vụ, thời gian gieo cấy hoặc kỹ thuật canh tác:
        </label>
        
        <div className="relative">
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAskQuestion();
              }
            }}
            placeholder="Ví dụ: Thời vụ gieo lúa Chiêm Xuân ở miền Bắc? Hoặc: Cách dùng tro bếp trị rầy cho rau?"
            className="w-full p-4 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none font-medium text-stone-800 placeholder-stone-400"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-stone-400">
              Nhấn <strong>Enter</strong> để gửi câu hỏi
            </span>

            <div className="flex items-center gap-2">
              {question && (
                <button
                  onClick={() => setQuestion('')}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
                >
                  Xóa
                </button>
              )}
              <button
                disabled={loading || !question.trim()}
                onClick={() => handleAskQuestion()}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tra cứu dữ liệu...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi câu hỏi</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preset Sample Queries */}
        <div className="pt-3 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-600 block mb-2">
            Câu hỏi mẫu để thử nghiệm nhanh:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(sq.query);
                  handleAskQuestion(sq.query);
                }}
                className="text-xs bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors text-left"
              >
                {sq.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Lỗi xử lý: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs text-center space-y-4 animate-pulse">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <h4 className="text-base font-bold text-stone-800 font-serif">
            Đang phân tích câu hỏi và đối chiếu tệp nongvu.json...
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Mô hình Gemini đang đọc kỹ các bản ghi lịch mùa vụ, tri thức bản địa và nguồn tư liệu để đảm bảo không bịa đặt thông tin.
          </p>
        </div>
      )}

      {/* Answer Result Display Card */}
      {currentResult && !loading && (
        <div className="bg-white rounded-3xl border-2 border-emerald-600/40 shadow-md overflow-hidden animate-in fade-in duration-300">
          {/* Header Metadata: Topic, Region, Source */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950">
                  {currentResult.topic}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-100 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Khu vực: {currentResult.region}</span>
                </span>
              </div>

              {/* Utility actions: Copy, Speech */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpeech}
                  className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
                  title={isSpeaking ? "Dừng đọc" : "Nghe đọc câu trả lời"}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
                  title="Sao chép câu trả lời"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <BookMarked className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Nguồn tư liệu trích dẫn: <strong>{currentResult.source}</strong></span>
            </div>
          </div>

          {/* Limitation Notice Card (MANDATORY CONSTRAINT) */}
          {currentResult.limitationNotice && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3.5 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-900 font-bold">Thông báo giới hạn thông tin:</strong>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  {currentResult.limitationNotice}
                </p>
              </div>
            </div>
          )}

          {/* Main Content Body */}
          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">
              Nội dung tư liệu & giải đáp canh tác:
            </h3>
            <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
              {currentResult.answer}
            </div>
          </div>

          {/* Footer Quality Verification Stamp */}
          <div className="bg-stone-50 px-6 py-3.5 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
            <span>Dữ liệu được đối chiếu trực tiếp từ tệp <code>nongvu.json</code></span>
            <span className="text-emerald-700 font-medium">Bảo chứng tính xác thực truyền thống</span>
          </div>
        </div>
      )}

      {/* Session History */}
      {history.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-700 flex items-center gap-2">
              <History className="w-4 h-4 text-stone-500" />
              <span>Lịch sử câu hỏi trong phiên ({history.length})</span>
            </h3>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Xóa lịch sử
            </button>
          </div>

          <div className="space-y-2">
            {history.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setQuestion(item.q);
                  setCurrentResult(item.a);
                }}
                className="p-3 bg-white hover:bg-stone-50 rounded-xl border border-stone-200 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div className="truncate pr-4">
                  <span className="font-semibold text-stone-800">{item.q}</span>
                  <span className="text-stone-400 ml-2">({item.a.topic})</span>
                </div>
                <span className="text-stone-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
