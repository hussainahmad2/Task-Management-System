import React, { useState } from 'react';
import { StickerPack, Sticker } from '../../types/messaging';

interface StickerPanelProps {
  stickerPacks: StickerPack[];
  stickers: Sticker[];
  onStickerSelect: (sticker: Sticker) => void;
  onClose?: () => void;
}

export const StickerPanel: React.FC<StickerPanelProps> = ({
  stickerPacks,
  stickers,
  onStickerSelect,
  onClose,
}) => {
  const [activePackId, setActivePackId] = useState<string | null>(null);

  // Group stickers by pack
  const groupedStickers = stickers.reduce((acc, sticker) => {
    if (!acc[sticker.packId]) {
      acc[sticker.packId] = [];
    }
    acc[sticker.packId].push(sticker);
    return acc;
  }, {} as Record<string, Sticker[]>);

  // Get stickers for the active pack or all stickers if no pack is selected
  const displayedStickers = activePackId
    ? groupedStickers[activePackId] || []
    : stickers;

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-30 flex flex-col">
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white">Stickers</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Pack selector */}
      <div className="flex p-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {stickerPacks.map(pack => (
          <button
            key={pack.id}
            onClick={() => setActivePackId(activePackId === pack.id ? null : pack.id)}
            className={`p-2 rounded-lg mr-2 flex-shrink-0 ${
              activePackId === pack.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="text-lg">😊</span>
          </button>
        ))}
      </div>
      
      {/* Sticker grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-6 gap-2">
          {displayedStickers.map(sticker => (
            <button
              key={sticker.id}
              onClick={() => onStickerSelect(sticker)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
            >
              <img
                src={sticker.imageUrl}
                alt={sticker.name}
                className="w-10 h-10 object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};