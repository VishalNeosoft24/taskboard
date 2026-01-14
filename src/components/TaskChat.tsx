"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, SendHorizonal, X, CornerDownRight, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [replyTarget, setReplyTarget] = useState<any>(null);
  const [showReactionsFor, setShowReactionsFor] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text, 2, replyTarget?.id || null);

    setText("");
    setReplyTarget(null);
  };

  const onTyping = (value: string) => {
    setText(value);
    setTyping(true);
    setTimeout(() => setTyping(false), 1200);
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

  const startReply = (m: any) => setReplyTarget(m);

  const addReaction = (id: number, emoji: string) => {
    setShowReactionsFor(null);
    reactingComment.mutate({ id, reaction: emoji });
  };

  return (
    <div className="flex flex-col h-[560px] rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-200">

      {/* HEADER */}
      <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg shadow">
        💬 Task Discussion
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 bg-gray-50">
        {messages.map((m: any) => {
          const mine = m.user?.id === currentUser?.id;
          const isEditing = editingId === m.id;

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex w-full ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[75%] p-3 rounded-2xl shadow-md group transition
                ${mine
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white border border-gray-200 rounded-tl-none text-gray-900"
                  }`}
              >

                {/* Reply Banner */}
                {m.reply_to && (
                  <div className={`text-xs mb-2 px-2 py-1 rounded-md bg-gray-200 text-gray-700`}>
                    <CornerDownRight size={12} className="inline mr-1" />
                    Reply to: {m.reply_to.comment?.slice(0, 30)}…
                  </div>
                )}

                {/* EDIT MODE */}
                {isEditing ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="w-full border px-3 py-2 rounded-lg text-gray-900"
                    />

                    <div className="flex gap-2 mt-2">
                      <button onClick={submitEdit} className="px-3 py-1 bg-green-600 text-white rounded">
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-600 text-white rounded">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Message */}
                    <p className="text-sm leading-relaxed break-words">{m.comment}</p>

                    {/* Timestamp */}
                    <div className={`text-[11px] mt-2 ${mine ? "text-white/70" : "text-gray-500"}`}>
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Actions */}
                    <div className={`flex gap-4 mt-1 opacity-0 group-hover:opacity-100 transition ${mine ? "text-white/80" : "text-gray-600"}`}>
                      <button onClick={() => startReply(m)} className="text-xs hover:text-blue-500">
                        Reply
                      </button>

                      <button onClick={() => setShowReactionsFor(m.id)} className="text-xs hover:text-pink-500">
                        React
                      </button>

                      {mine && (
                        <>
                          <button onClick={() => startEdit(m)} className="text-xs hover:text-yellow-300">
                            Edit
                          </button>
                          <button onClick={() => removeComment.mutate(m.id)} className="text-xs hover:text-red-500">
                            Delete
                          </button>
                        </>
                      )}
                    </div>

                    {/* Reaction Picker */}
                    {showReactionsFor === m.id && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white shadow-xl px-4 py-2 rounded-full flex gap-3 z-50 border"
                        >
                          {REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(m.id, emoji)}
                              className="hover:scale-125 text-xl transition"
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Show Reactions */}
                    {m.reactions?.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {m.reactions.map((r: any, i: number) => (
                          <span
                            key={i}
                            className="text-xs bg-white/30 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {r.emoji} {r.count}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUser && (
        <div className="px-4 pb-1 text-xs text-blue-600 animate-pulse">
          ✍️ {typingUser} is typing…
        </div>
      )}

      {/* Reply Preview */}
      {replyTarget && (
        <div className="bg-blue-50 px-4 py-2 text-sm border-t flex justify-between">
          <span>
            <b>{replyTarget.user?.username}: </b>
            {replyTarget.comment.slice(0, 50)}…
          </span>
          <button onClick={() => setReplyTarget(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4 bg-white flex gap-3 items-center">
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition shadow-sm">
          <Paperclip size={20} />
        </button>

        <input
          value={text}
          onChange={(e) => onTyping(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-full shadow-sm focus:ring focus:ring-blue-300"
          placeholder="Message…"
        />

        <motion.button
          onClick={handleSend}
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <SendHorizonal size={20} />
        </motion.button>
      </div>
    </div>
  );
}
