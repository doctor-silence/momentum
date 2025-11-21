import React, { useEffect, useMemo, useRef, useState } from "react";
import agentSDK from '@/api/agentSDK';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentPicker from "@/components/agents/AgentPicker";
import MessageBubble from "@/components/agents/MessageBubble";
import { AlertCircle, Send, Sparkles } from "lucide-react";
import PromptChips, { getQAPrompt } from "@/components/agents/PromptChips";
import { UploadFile } from "@/api/integrations";

export default function Agents() {
  const [agentName, setAgentName] = useState("content_strategist");
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [attachments, setAttachments] = useState([]); // File objects
  const [uploading, setUploading] = useState(false);
  const unsubRef = useRef(null);

  // Start a new conversation or switch agent
  const startConversation = async (name = agentName) => {
    // cleanup any existing subscription
    if (typeof unsubRef.current === "function") {
      try { unsubRef.current(); } catch (e) { console.error("Error unsubscribing:", e); }
      unsubRef.current = null;
    }
    const conv = agentSDK.createConversation({
      agent_name: name,
      metadata: { name: `${name.replaceAll("_", " ")} chat`, description: "Agent Studio" }
    });
    setConversation(conv);
    setMessages(conv.messages || []);
    const unsubscribe = agentSDK.subscribeToConversation(conv.id, (data) => {
      // guard against late streams from old conversations
      if (conv.id && data.id && data.id !== conv.id) return;
      setMessages(data.messages || []);
    });
    unsubRef.current = unsubscribe;
    return conv; // return conversation so callers can await it
  };

  useEffect(() => {
    // create initial conversation on first load; support deep-link params
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get("agent") || "content_strategist";
    const qaAuto = params.get("qa") === "true";

    setAgentName(fromParam);
    startConversation(fromParam).then(() => {
      // The existing code uses "qa_auditor" for the QA agent.
      // We will consistently use "qa_tester" here for the auto-trigger.
      if (qaAuto && fromParam === "qa_tester") {
        // kick off the full QA audit automatically
        handleInsertAndSend(getQAPrompt());
      }
    });

    return () => {
      if (typeof unsubRef.current === "function") {
        try { unsubRef.current(); } catch (e) { console.error("Error unsubscribing:", e); }
        unsubRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInsertAndSend = async (text) => {
    setInput(text);
    // auto-send after short tick to let input render
    setTimeout(() => handleSend(text), 0);
  };

  const handleAttachFiles = (filesList) => {
    const files = Array.from(filesList || []);
    if (files.length === 0) return;
    setAttachments((prev) => [...prev, ...files].slice(0, 6)); // cap at 6
  };

  const clearAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSend = async (overrideText = null) => {
    if (busy) return;
    const text = (overrideText ?? input ?? "").trim();
    if (!text && attachments.length === 0) return;

    setBusy(true);
    setError(null);

    try {
      let conv = conversation;
      if (!conv) {
        conv = await startConversation(agentName);
      }

      // upload attachments if any with per-file status
      let fileUrls = [];
      if (attachments.length > 0) {
        setUploading(true);
        const uploads = attachments.map((f) => UploadFile({ file: f }));
        const results = await Promise.allSettled(uploads);
        const urls = [];
        const nextAttachments = [];
        results.forEach((res, idx) => {
          const file = attachments[idx];
          if (res.status === "fulfilled" && (res.value?.file_url || res.value?.url)) {
            urls.push(res.value.file_url || res.value.url);
            nextAttachments.push(Object.assign(file, { _status: "uploaded" }));
          } else {
            nextAttachments.push(Object.assign(file, { _status: "error" }));
          }
        });
        fileUrls = urls;
        setAttachments(nextAttachments);
        setUploading(false);
      }

      // Optimistically display user's message
      const optimistic = { role: "user", content: text, file_urls: fileUrls };
      setMessages((prev) => [...(prev || []), optimistic]);

      // Fire the actual send (subscription will stream assistant + tool calls)
      await agentSDK.addMessage(conv, optimistic);

      // Clear input after successful queue
      setInput("");
      // Keep attachments that failed so user can retry/remove
      setAttachments((prev) => (prev || []).filter((f) => f._status !== "uploaded"));
    } catch (e) {
      console.error("Agent send error:", e);
      setError(`Не удалось отправить сообщение. ${e?.message ? `Детали: ${e.message}` : "Пожалуйста, попробуйте снова."}`);
    } finally {
      setBusy(false);
      setUploading(false);
    }
  };

  const starterPrompt = useMemo(() => {
    switch (agentName) {
      case "content_strategist":
        return "Помогите мне спланировать контент на эту неделю и составить 3 поста для LinkedIn о моём ключевом сообщении.";
      case "calendar_planner":
        return "Посмотрите мои черновики и создайте график публикаций на следующие 2 недели. Спросите подтверждение перед планированием.";
      case "analytics_researcher":
        return "Просмотрите мои последние посты и скажите, что улучшить на следующей неделе. Будьте конкретны.";
      case "qa_tester":
        return "Проверьте мой контент на фактическую точность, грамматику, тон и общее качество. Предоставьте конкретную обратную связь.";
      default:
        return "Привет!";
    }
  }, [agentName]);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Студия агентов</h1>
        </div>

        <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
          <CardHeader className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <CardTitle className="text-white">Чат с агентом</CardTitle>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <AgentPicker
                value={agentName}
                onChange={(v) => {
                  setAgentName(v);
                  startConversation(v);
                }}
              />
              <Button onClick={() => startConversation(agentName)} variant="outline" className="bg-white/10 border-white/20 text-white">
                Новый разговор
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentName === "qa_tester" && ( // Changed from qa_auditor to qa_tester for consistency
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  onClick={() => handleInsertAndSend(getQAPrompt())}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                >
                  Запустить полный QA-аудит
                </Button>
              </div>
            )}

            {/* Quick prompt chips */}
            <PromptChips onInsertAndSend={handleInsertAndSend} />

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-white">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 h-[420px] overflow-auto">
              {messages.length === 0 ? (
                <div className="text-white/70 text-sm">
                  Try: “{starterPrompt}” or use the chips above.
                </div>
              ) : (
                messages.map((m, idx) => <MessageBubble key={idx} message={m} />)
              )}
            </div>

            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((f, i) => (
                  <div
                    key={i}
                    className={`text-xs text-white/80 rounded px-2 py-1 flex items-center gap-2 ${
                      f._status === "error" ? "bg-red-500/20 border border-red-400/30" : "bg-white/10 border border-white/20"
                    }`}
                  >
                    <span className="max-w-[220px] truncate">{f.name}</span>
                    {f._status === "error" && <span className="text-red-300">Error</span>}
                    <button onClick={() => clearAttachment(i)} className="text-white/60 hover:text-white">✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Composer */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Напишите ваше сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                autoFocus
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                aria-label="Message input"
              />
              <div className="flex gap-2">
                <input
                  id="filePicker"
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => handleAttachFiles(e.target.files)}
                  className="hidden"
                />
                <label
                  htmlFor="filePicker"
                  className="inline-flex items-center px-3 rounded-md bg-white/10 border border-white/20 text-white text-sm cursor-pointer hover:bg-white/20"
                >
                  {uploading ? "Загрузка..." : "Прикрепить"}
                </label>
                <Button
                  onClick={() => handleSend()}
                  disabled={busy || uploading}
                  aria-label="Отправить сообщение"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <Send className="w-4 h-4 mr-2" /> {busy ? "Отправка..." : "Отправить"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}