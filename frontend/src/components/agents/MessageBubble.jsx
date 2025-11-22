import React from "react";
import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-1`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  isUser
                    ? "bg-slate-800 text-white"
                    : "bg-white/10 border border-white/20 text-white"
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>        {/* Tool call summaries (if any) */}
        {message.tool_calls?.length > 0 && (
          <div className="mt-2 text-xs text-white/80">
            {message.tool_calls.map((t, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-2 mb-1">
                <div className="opacity-80">Tool: {t?.name || "entity"}</div>
                {t?.status && <div>Status: {t.status}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}