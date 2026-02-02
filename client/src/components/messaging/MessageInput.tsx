import React, { useState, useRef, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string, file?: File) => void;
  onSendSticker?: (stickerId: string) => void;
  onSendEmoji?: (emoji: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendSticker,
  onSendEmoji,
  placeholder = 'Type a message...',
  disabled = false,
  className
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage(inputValue, file);
      setInputValue('');
    }
    // Reset the input to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleStickerClick = (stickerId: string) => {
    onSendSticker?.(stickerId);
    setShowStickerPanel(false);
  };

  return (
    <div className={cn("border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800", className)}>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            disabled={disabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-full hover:bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-600 dark:text-yellow-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-md hover:shadow-lg"
            disabled={disabled}
          >
            <span className="text-2xl drop-shadow-sm">😊</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowStickerPanel(!showStickerPanel)}
            className="p-2 rounded-full hover:bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-300 transition-all duration-300 transform hover:scale-110 hover:-rotate-12 shadow-md hover:shadow-lg"
            disabled={disabled}
          >
            <span className="text-2xl drop-shadow-sm">🔥</span>
          </button>
        </div>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 rounded-full border-2 border-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-600 dark:to-pink-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-500/40 focus:border-transparent transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={disabled}
          />
          
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 left-0 w-72 h-56 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 border-2 border-purple-200 dark:border-purple-700 rounded-xl shadow-2xl p-3 z-10 backdrop-blur-sm">
              <div className="grid grid-cols-8 gap-2">
                {['😀', '😂', '🥰', '😎', '🤩', '😍', '🤗', '🤔', '🥳', '🤪', '😇', '🥸', '🤓', '🧐', '🥹', '🥺'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-2xl hover:bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-2 transition-all duration-200 transform hover:scale-125 hover:rotate-12 shadow-md"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
                    
          {showStickerPanel && (
            <div className="absolute bottom-full mb-2 left-0 w-72 h-56 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-gray-900 border-2 border-pink-200 dark:border-pink-700 rounded-xl shadow-2xl p-3 z-10 backdrop-blur-sm">
              <div className="grid grid-cols-4 gap-3">
                {['🔥', '🚀', '💯', '🎯', '✨', '🎉', '🎊', '🎁'].map((sticker, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleStickerClick(`sticker-${index}`)}
                    className="text-3xl hover:bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-3 transition-all duration-200 transform hover:scale-125 hover:rotate-12 shadow-md"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!inputValue.trim() || disabled}
          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
            inputValue.trim()
              ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl animate-pulse'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};