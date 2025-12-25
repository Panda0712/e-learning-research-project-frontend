import { useState } from "react";
import { Search } from "lucide-react";

interface User {
  id: number;
  name: string;
  avatar: string;
  role: string;
  unreadCount?: number;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

const mockUsers: User[] = [
  { id: 1, name: "Veli Dincer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", role: "Student", unreadCount: 0 },
  { id: 2, name: "Theresa Webb", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", role: "Student", unreadCount: 3 },
  { id: 3, name: "Eleanor Pena", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", role: "Student" },
  { id: 4, name: "Jane Cooper", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", role: "Student" },
  { id: 5, name: "Brooklyn Simmons", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", role: "Student" },
  { id: 6, name: "Dianne Russell", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", role: "Student" },
  { id: 7, name: "Floyd Miles", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", role: "Student" },
];

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 1,
    text: "Hi I have Some Querries regarding 2nd Chaper",
    timestamp: "40 mins ago",
    isOwn: false,
  },
  {
    id: 2,
    senderId: 0,
    text: "Sure, Let me know what is issue?",
    timestamp: "40 mins ago",
    isOwn: true,
  },
];

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<User>(mockUsers[0]);
  const [messages] = useState<Message[]>(mockMessages);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Send message:", messageText);
      setMessageText("");
    }
  };

  const handleDeleteChat = () => {
    console.log("Delete chat with:", selectedUser.name);
  };

  const handleBlockUser = () => {
    console.log("Block user:", selectedUser.name);
  };

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-250px)] gap-6">
      {/* Left Sidebar - Users List */}
      <div className="w-80 rounded-xl border border-gray-200 bg-white">
        {/* Search */}
        <div className="border-b border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search User"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 font-poppins text-sm text-[#000000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100% - 80px)" }}>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${
                selectedUser.id === user.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  {user.unreadCount && user.unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6] font-poppins text-xs text-white">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-poppins text-sm font-medium text-[#000000]">{user.name}</p>
                  <p className="font-poppins text-xs text-[#475569]">{user.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div>
              <p className="font-poppins text-base font-semibold text-[#000000]">
                {selectedUser.name}
              </p>
              <p className="font-poppins text-sm text-[#475569]">{selectedUser.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteChat}
              className="rounded-lg bg-gray-100 px-4 py-2 font-poppins text-sm font-medium text-[#000000] transition-colors hover:bg-gray-200"
            >
              Delete
            </button>
            <button
              onClick={handleBlockUser}
              className="rounded-lg bg-[#FF0000] px-4 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-red-600"
            >
              Block
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md rounded-2xl px-4 py-3 ${
                    message.isOwn
                      ? "bg-gray-200 text-[#000000]"
                      : "bg-white text-[#000000] shadow-sm ring-1 ring-gray-200"
                  }`}
                >
                  <p className="font-poppins text-sm">{message.text}</p>
                  <p className="mt-1 font-poppins text-xs text-[#475569]">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="There?"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-poppins text-sm text-[#000000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="rounded-lg bg-[#16A34A] px-6 py-2.5 font-poppins text-sm font-medium text-white transition-colors hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
