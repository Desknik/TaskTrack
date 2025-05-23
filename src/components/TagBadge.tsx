import React, { useMemo } from 'react';

interface TagBadgeProps {
  tag: string;
}

// Lista de cores para tags
const TAG_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-green-100', text: 'text-green-800' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  { bg: 'bg-red-100', text: 'text-red-800' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  { bg: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-pink-100', text: 'text-pink-800' },
  { bg: 'bg-teal-100', text: 'text-teal-800' },
];

/**
 * Gera um índice de cor consistente baseado na string da tag
 */
const getColorIndexFromString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % TAG_COLORS.length;
};

const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
  const colorIndex = useMemo(() => getColorIndexFromString(tag), [tag]);
  const { bg, text } = TAG_COLORS[colorIndex];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {tag}
    </span>
  );
};

export default TagBadge;
