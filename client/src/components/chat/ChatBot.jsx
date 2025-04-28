import { useState, useRef, useEffect } from 'react';
import { FiSend, FiX } from 'react-icons/fi';
import { BsChatDotsFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const userId = useSelector((state) => state.login.user?.id || localStorage.getItem('user_id'));

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:9000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          userId: userId 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-50 bottom-8 right-12">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 bg-blue-500 rounded-full hover:bg-blue-600 hover:scale-105"
        >
          <BsChatDotsFill size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] h-[400px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-300">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">예약 도우미</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 p-3 overflow-y-auto text-xs"
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg whitespace-pre-wrap break-words max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-start mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 p-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                <FiSend size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 