import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/constants";
import axios from "axios";
import type { MessageType } from "../types/message";
import type { User } from "../types/user";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((store: { user: User | null }) => store.user);
  const userId = user?._id;

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchChatMessages = async () => {
    if (!userId || !targetUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL + `/chat/${targetUserId}`, {
        withCredentials: true,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chatMessages = response?.data?.chat.messages.map((msg: any) => {
        const { senderId, text } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setError("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchChatMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, targetUserId]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !userId || !targetUserId) return;

    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!targetUserId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-error">No chat selected</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto border border-base-300 rounded-lg m-5 h-[70vh] flex flex-col bg-base-100">
      {/* Header */}
      <div className="p-4 border-b border-base-300 bg-base-200">
        <h1 className="text-xl font-semibold">Chat</h1>
        {error && <div className="text-error text-sm mt-1">{error}</div>}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-20 text-base-content/60">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = user?.firstName === message.firstName;

            return (
              <div
                key={index}
                className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-header">
                  {!isOwnMessage && `${message.firstName} ${message.lastName}`}
                </div>
                <div
                  className={`chat-bubble ${
                    isOwnMessage
                      ? "chat-bubble-primary"
                      : "chat-bubble-secondary"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-base-300 bg-base-200">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!targetUserId}
            className="flex-1 input input-bordered"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !targetUserId}
            className="btn btn-primary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
