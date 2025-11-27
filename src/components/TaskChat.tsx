"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, SendHorizonal, X, CornerDownRight } from "lucide-react";

const REACTIONS = ["👍", "❤️", "😂", "🔥", "😮", "👎"];

export default function TaskChat({
  messages = [],
  sendMessage,
  editComment,
  removeComment,
  reactingComment,
  currentUser,
  typingUser,
  setTyping,
}: any) {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<any>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyTarget, setReplyTarget] = useState<any>(null);
  const [showReactionsFor, setShowReactionsFor] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);

    sendMessage(text, 2, replyTarget?.id || null);

    setText("");
    setReplyTarget(null);
    setLoading(false);
  };

  const onTyping = (value: string) => {
    setText(value);
    setTyping(true);
    setTimeout(() => setTyping(false), 2000);
  };

  const startEdit = (m: any) => {
    setEditingId(m.id);
    setEditText(m.comment);
  };

  const submitEdit = () => {
    editComment.mutate({ id: editingId, text: editText });
    setEditingId(null);
    setEditText("");
  };

  const addReaction = (id: number, emoji: string) => {
    setShowReactionsFor(null);
    reactingComment.mutate({ id, reaction: emoji });
  };

  return (
    <div className="flex flex-col h-[560px] border rounded-xl shadow bg-white overflow-hidden">

      {/* HEADER */}
      <div className="px-5 py-3 bg-gray-100 border-b font-semibold text-lg">
        Task Discussion 💬
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 bg-gray-50">

        {messages.map((m: any) => {
          const isMine = m.user?.id === currentUser?.id;
          const isEditing = editingId === m.id;

          return (
            <div key={m.id} className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>

              <div
                className={`relative max-w-[75%] p-3 rounded-2xl shadow-md group
                  bg-white border text-gray-800
                `}
              >
                {/* Reply banner */}
                {m.reply_to && (
                  <div className="text-xs mb-2 bg-gray-200 px-2 py-1 rounded-md text-gray-700">
                    <CornerDownRight size={12} className="inline mr-1" />
                    Replying to: {m.reply_to.comment?.slice(0, 40)}...
                  </div>
                )}

                {/* EDIT MODE */}
                {isEditing ? (
                  <>
                    <textarea
                      value={editText}
                      rows={2}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg text-gray-900"
                    />

                    <div className="flex gap-2 mt-2">
                      <button onClick={submitEdit} className="px-3 py-1 bg-blue-600 text-white rounded">
                        Update
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* MAIN MESSAGE */}
                    <p className="text-sm leading-relaxed break-words">{m.comment}</p>

                    {/* TIME */}
                    <div className="text-[11px] opacity-50 mt-2 text-right">
                      {new Date(m.created_at).toLocaleString()}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-4 mt-2 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => startReply(m)} className="text-xs text-blue-600 font-medium">
                        Reply
                      </button>

                      <button
                        onClick={() => setShowReactionsFor(m.id)}
                        className="text-xs text-pink-600 font-medium"
                      >
                        React
                      </button>

                      {isMine && (
                        <>
                          <button onClick={() => startEdit(m)} className="text-xs text-yellow-600 font-medium">
                            Edit
                          </button>

                          <button
                            onClick={() => removeComment.mutate(m.id)}
                            className="text-xs text-red-600 font-medium"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>

                    {/* REACTION PICKER */}
                    {showReactionsFor === m.id && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white shadow-xl px-4 py-2 rounded-full flex gap-3 z-50">
                        {REACTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(m.id, emoji)}
                            className="hover:scale-125 text-xl transition"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* SHOW REACTIONS */}
                    {m.reactions?.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {m.reactions.map((r: any, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                          >
                            {r.emoji} {r.count}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* TYPING INDICATOR */}
      {typingUser && (
        <div className="px-4 pb-1 text-xs text-gray-500 animate-pulse">
          {typingUser} is typing…
        </div>
      )}

      {/* REPLY PREVIEW */}
      {replyTarget && (
        <div className="bg-blue-50 px-4 py-2 text-sm border-t flex justify-between">
          <div>
            <strong>{replyTarget.user?.username}:</strong>{" "}
            {replyTarget.comment.slice(0, 50)}...
          </div>
          <button onClick={() => setReplyTarget(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* INPUT */}
      <div className="border-t p-4 bg-white flex gap-3 items-center">
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
          <Paperclip size={20} />
        </button>

        <input
          value={text}
          onChange={(e) => onTyping(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-full shadow-sm"
          placeholder="Write a message…"
        />

        {!loading ? (
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <SendHorizonal size={20} />
          </button>
        ) : (
          <div className="w-6 h-6 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
}
