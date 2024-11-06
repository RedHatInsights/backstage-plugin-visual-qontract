import { Box, IconButton } from '@mui/material';
import React from 'react';

const stringToColor = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 80%)`;
};

const getTextColor = (bgColor: string) => {
  const [h, s, l] = bgColor.match(/\d+/g)!.map(Number);
  return l > 60 ? 'black' : 'white';
};

export const PillList = ({
  items,
  field,
  onClick,
  removable = false,
  dataTestIdPrefix = '', // Optional prefix for data-testid
}: {
  items: string[];
  field: string;
  onClick: (field: string, item: string) => void;
  removable?: boolean;
  dataTestIdPrefix?: string;
}) => (
  <Box display="flex" flexWrap="wrap" gap={1}>
    {items.map(item => {
      if (!item) return null;
      const normalizedItem = item.trim();
      const bgColor = stringToColor(normalizedItem);
      const textColor = getTextColor(bgColor);
      return (
        <Box
          key={normalizedItem}
          data-testid={
            dataTestIdPrefix
              ? `${dataTestIdPrefix}-${field}-pill-${normalizedItem}`
              : undefined // Only add data-testid when a prefix is provided
          }
          sx={{
            backgroundColor: bgColor,
            color: textColor,
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8em',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            cursor: 'pointer',
          }}
          onClick={() => !removable && onClick(field, normalizedItem)}
        >
          <span>{normalizedItem}</span>
          {removable && (
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                onClick(field, normalizedItem);
              }}
              data-testid={
                dataTestIdPrefix
                  ? `${dataTestIdPrefix}-remove-${field}-pill-${normalizedItem}`
                  : undefined
              }
              sx={{ marginLeft: '4px', padding: 0, color: textColor }}
            >
              ×
            </IconButton>
          )}
        </Box>
      );
    })}
  </Box>
);
