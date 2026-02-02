import React from 'react';

interface ReactionPickerProps {
  onReact: (emoji: string) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onReact,
  onClose,
  position = { top: 0, left: 0 },
}) => {
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div
      className="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-20"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex space-x-1">
        {reactions.map((reaction, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              onReact(reaction);
              onClose();
            }}
            className="text-xl p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {reaction}
          </button>
        ))}
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          ✕
        </button>
      </div>
    </div>
  );
};