import { Bot, Send, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { chatService } from "../../apis/chat";

type Sender = "bot" | "user" | "system";

type ChatMessage = {
  id: number;
  sender: Sender;
  content: string;
  time: string;
};

const formatTime = () =>
  new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: "system",
    content:
      "Đoạn chat đã được đánh dấu hoàn thành. Gửi tin nhắn mới để kết nối lại với AI hỗ trợ.",
    time: formatTime(),
  },
  {
    id: 2,
    sender: "system",
    content: "AI đã kết nối. Bạn có thể bắt đầu trò chuyện!",
    time: formatTime(),
  },
  {
    id: 3,
    sender: "bot",
    content: "Xin chào, mình là AI chatbot. Hãy gửi câu hỏi để mình tư vấn khóa học cho bạn.",
    time: formatTime(),
  },
];

const QUICK_QUESTIONS = [
  "Bạn đang có khóa học nào?",
  "Khóa Java có gì nổi bật?",
  "Khóa C# căn bản học trong bao lâu?",
];

const renderBotMessageContent = (content: string): ReactNode => {
  const normalized = content
    .replace(/\s+(?=\d+\.)/g, "\n")
    .replace(/\s*\|\s*/g, " | ")
    .trim();

  const numberedItems = [
    ...normalized.matchAll(/(?:^|\n)(\d+\.\s*[\s\S]*?)(?=(?:\n\d+\.)|$)/g),
  ].map((item) => item[1].trim());

  const hasStructuredList = numberedItems.length >= 2;

  if (hasStructuredList) {
    const intro = normalized.split(/\n\d+\./)[0]?.trim();

    return (
      <div className="space-y-2">
        {intro && <p className="font-medium text-slate-700">{intro}</p>}
        <div className="space-y-2">
          {numberedItems.map((item) => {
            const withoutIndex = item.replace(/^\d+\.\s*/, "").trim();
            const segments = withoutIndex
              .split("|")
              .map((segment) => segment.trim())
              .filter(Boolean);

            return (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <p className="font-semibold text-slate-800">
                  {segments[0] || withoutIndex}
                </p>
                {segments.length > 1 && (
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-slate-500">
                    {segments.slice(1).map((segment) => (
                      <span
                        key={`${item}-${segment}`}
                        className="rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200"
                      >
                        {segment}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {content
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => (
          <p key={line}>{line}</p>
        ))}
    </div>
  );
};

const AiChatWidget = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const hidden = useMemo(
    () =>
      pathname.startsWith("/auth") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/learning"),
    [pathname],
  );

  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [messages, isTyping, isOpen]);

  if (hidden) return null;

  const pushMessage = (sender: Sender, content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender,
        content,
        time: formatTime(),
      },
    ]);
  };

  const sendMessage = async (rawText: string) => {
    const content = rawText.trim();
    if (!content || isTyping) return;

    pushMessage("user", content);
    setInput("");
    setIsTyping(true);

    try {
      const safeConversationId =
        typeof conversationId === "string" && conversationId.trim().length >= 3
          ? conversationId.trim()
          : undefined;

      const response = await chatService.chatbotChatAPI({
        question: content,
        ...(safeConversationId ? { conversationId: safeConversationId } : {}),
      });

      const answer =
        typeof response?.answer === "string" && response.answer.trim()
          ? response.answer
          : "Mình chưa thể tạo phản hồi lúc này, bạn thử lại giúp mình nhé.";

      if (typeof response?.conversationId === "string") {
        setConversationId(response.conversationId);
      }

      pushMessage("bot", answer);
    } catch {
      pushMessage(
        "bot",
        "Mình đang gặp lỗi kết nối chatbot. Bạn thử lại sau ít phút nhé.",
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 z-50 sm:right-6">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-[0_12px_35px_rgba(13,148,198,0.45)] transition-transform duration-200 hover:scale-105"
          aria-label="Open AI chatbot"
        >
          <Bot size={28} />
        </button>
      )}

      {isOpen && (
        <div className="flex h-140 w-87.5 flex-col overflow-hidden rounded-[22px] border border-cyan-100 bg-white shadow-[0_20px_45px_rgba(10,80,120,0.25)] sm:w-95">
          <div className="flex items-start justify-between bg-linear-to-r from-cyan-400 via-sky-500 to-blue-500 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-lg font-semibold leading-5">AI Chatbot</p>
                <p className="text-sm text-cyan-50">Đang trực tuyến</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-cyan-50 transition hover:bg-white/20"
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={viewportRef}
            className="flex-1 space-y-3 overflow-y-auto bg-linear-to-b from-white via-slate-50 to-cyan-50/50 px-4 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {messages.map((message) => {
              if (message.sender === "system") {
                return (
                  <div
                    key={message.id}
                    className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500"
                  >
                    {message.content}
                  </div>
                );
              }

              const isUser = message.sender === "user";
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "rounded-br-md bg-linear-to-r from-cyan-400 via-sky-500 to-blue-500 text-white"
                        : "rounded-bl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"
                    }`}
                  >
                    {isUser ? (
                      <p>{message.content}</p>
                    ) : (
                      renderBotMessageContent(message.content)
                    )}
                    <p
                      className={`mt-1 text-right text-xs ${isUser ? "text-cyan-100" : "text-slate-400"}`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-2 text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.05s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white px-3 pb-3 pt-2">
            <div className="mb-2 flex flex-wrap gap-2 pb-1">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  type="button"
                  key={question}
                  onClick={() => sendMessage(question)}
                  disabled={isTyping}
                  className="whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 transition hover:bg-cyan-100"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                disabled={isTyping}
                placeholder="Nhập tin nhắn..."
                className="h-11 flex-1 rounded-full border border-sky-400 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={isTyping}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-md transition hover:scale-105"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatWidget;
