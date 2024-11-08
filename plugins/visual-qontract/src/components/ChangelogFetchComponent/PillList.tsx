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

const Pill = ({
  item,
  field,
  onClick,
  removable,
  clickable,
  dataTestId,
}: {
  item: string;
  field: string;
  onClick: (field: string, item: string) => void;
  removable?: boolean;
  clickable?: boolean;
  dataTestId?: string;
}) => {
  const bgColor = stringToColor(item);
  const textColor = getTextColor(bgColor);

  return (
    <Box
      key={item}
      data-testid={dataTestId}
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
        cursor: clickable ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': clickable
          ? {
              transform: 'scale(1.05)',
              boxShadow: `0px 0px 8px 2px ${bgColor}`,
            }
          : undefined,
      }}
      onClick={() => !removable && clickable && onClick(field, item)}
    >
      <span>{item}</span>
      {removable && (
        <IconButton
          size="small"
          onClick={e => {
            e.stopPropagation();
            onClick(field, item);
          }}
          data-testid={`active-filter-remove-${field}-pill-${item}`}
          sx={{ marginLeft: '4px', padding: 0, color: textColor }}
        >
          ×
        </IconButton>
      )}
    </Box>
  );
};

export const PillList = ({
  items,
  field,
  onClick,
  removable = false,
  clickable = true,
  dataTestIdPrefix = '',
}: {
  items: string[];
  field: string;
  onClick: (field: string, item: string) => void;
  removable?: boolean;
  clickable?: boolean;
  dataTestIdPrefix?: string;
}) => (
  <Box display="flex" flexWrap="wrap" gap={1}>
    {items.map(item => {
      if (!item) return null;
      const normalizedItem = item.trim();
      const dataTestId = dataTestIdPrefix
        ? `${dataTestIdPrefix}-${field}-pill-${normalizedItem}`
        : undefined;

      return (
        <Pill
          key={normalizedItem}
          item={normalizedItem}
          field={field}
          onClick={onClick}
          removable={removable}
          clickable={clickable}
          dataTestId={dataTestId}
        />
      );
    })}
  </Box>
);
