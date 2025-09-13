import React, { useState, useEffect, useRef } from 'react';

import LayoutWithSidebar from '../components/Layout/LayoutWithSidebar';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const conversations = [
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        online: true,
        category: 'House Cleaning'
      },
      lastMessage: 'Looking forward to working with you!',
      timestamp: 'Just now',
      unread: 2
    },
    {
      id: 2,
      user: {
        name: 'Mike Chen',
        avatar: 'MC',
        online: false,
        category: 'Web Development'
      },
      lastMessage: 'I\'ve sent the project files',
      timestamp: '2 hours ago',
      unread: 0
    },
    {
      id: 3,
      user: {
        name: 'Emily Rodriguez',
        avatar: 'ER',
        online: true,
        category: 'Graphic Design'
      },
      lastMessage: 'Can we schedule a call tomorrow?',
      timestamp: '5 hours ago',
      unread: 1
    },
    {
      id: 4,
      user: {
        name: 'David Kim',
        avatar: 'DK',
        online: false,
        category: 'Photography'
      },
      lastMessage: 'The photos are ready for review',
      timestamp: '1 day ago',
      unread: 0
    }
  ];

  const messagesData = {
    1: [
      { id: 1, sender: 'other', text: 'Hi! I need house cleaning services this weekend', timestamp: '2:30 PM' },
      { id: 2, sender: 'me', text: 'Hello! I\'m available Saturday and Sunday. What type of cleaning do you need?', timestamp: '2:32 PM' },
      { id: 3, sender: 'other', text: 'Just general cleaning for my 2-bedroom apartment. What are your rates?', timestamp: '2:35 PM' },
      { id: 4, sender: 'me', text: 'For 2-bedroom, it\'s $80 for basic cleaning. Deep cleaning is $120.', timestamp: '2:40 PM' },
      { id: 5, sender: 'other', text: 'Perfect! Let\'s do basic cleaning this Saturday at 10 AM.', timestamp: '2:45 PM' },
      { id: 6, sender: 'me', text: 'Great! I\'ve booked you for Saturday 10 AM. See you then!', timestamp: '2:50 PM' },
      { id: 7, sender: 'other', text: 'Looking forward to working with you!', timestamp: '2:51 PM' }
    ],
    2: [
      { id: 1, sender: 'other', text: 'Hi, I need a website for my business', timestamp: 'Yesterday' },
      { id: 2, sender: 'me', text: 'Sure! What type of website are you looking for?', timestamp: 'Yesterday' },
      { id: 3, sender: 'other', text: 'An e-commerce site for my clothing store', timestamp: 'Yesterday' },
      { id: 4, sender: 'me', text: 'I\'ve sent the project files and proposal', timestamp: '2 hours ago' }
    ],
    3: [
      { id: 1, sender: 'other', text: 'I love your design portfolio!', timestamp: '5 hours ago' },
      { id: 2, sender: 'me', text: 'Thank you! What type of design work do you need?', timestamp: '5 hours ago' },
      { id: 3, sender: 'other', text: 'Logo and branding for my new startup', timestamp: '5 hours ago' },
      { id: 4, sender: 'me', text: 'Can we schedule a call tomorrow to discuss details?', timestamp: '5 hours ago' }
    ],
    4: [
      { id: 1, sender: 'other', text: 'Are you available for product photography next week?', timestamp: '1 day ago' },
      { id: 2, sender: 'me', text: 'Yes, I have availability Tuesday and Wednesday', timestamp: '1 day ago' },
      { id: 3, sender: 'other', text: 'The photos are ready for your review', timestamp: '1 day ago' }
    ]
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConvData = conversations.find(conv => conv.id === selectedConversation);
  const currentMessages = selectedConversation ? messagesData[selectedConversation] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const formatTime = (timestamp) => {
    return timestamp;
  };

  return (
    <LayoutWithSidebar>
      <div className="flex h-[calc(100vh-2rem)] bg-gray-50">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation === conversation.id 
                    ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{conversation.user.avatar}</span>
                    </div>
                    {conversation.user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {conversation.user.name}
                      </h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <p className="text-xs text-blue-600 mb-1">{conversation.user.category}</p>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area - iMessage Style */}
        <div className="flex-1 flex flex-col">
          {selectedConvData ? (
            <>
              {/* Chat Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{selectedConvData.user.avatar}</span>
                    </div>
                    {selectedConvData.user.online && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedConvData.user.name}</h2>
                    <p className="text-sm text-gray-500">{selectedConvData.user.category}</p>
                  </div>
                </div>
              </div>

              {/* Messages Area - iMessage Style */}
              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 to-gray-50">
                <div className="max-w-2xl mx-auto space-y-3">
                  {currentMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender === 'me'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 text-right ${
                            message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input - iMessage Style */}
              <div className="bg-white px-6 py-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="iMessage"
                      className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-comments text-white text-3xl"></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Messages</h3>
                <p className="text-gray-600 mb-6">Select a conversation to start messaging</p>
                <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li>• Message clients about their gig requests</li>
                    <li>• Discuss project details and timelines</li>
                    <li>• Share files and updates securely</li>
                    <li>• Get quick responses to your questions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
};

export default Messages;