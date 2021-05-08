import React from 'react';
import colors from '../../../colors';
import Button from '../Button';

export type ColorSwatchProps = {
  color: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
};

const ColorSwatch: React.VFC<ColorSwatchProps> = ({
  color: colorProp,
  onClick,
  selected = false,
}) => {
  const color = colors.find((c) => c.label === colorProp || c.slug === colorProp);

  return (
    <Button
      circle
      aria-label={color?.label}
      color="secondary"
      sx={{
        backgroundColor: `${color?.code ?? '#000'} !important`,
        borderColor: selected ? 'common.white' : undefined,
        borderStyle: 'solid',
        borderWidth: 2,
        color: 'transparent',

        '&:hover': {
          borderColor: selected ? 'common.white' : undefined,
        },
      }}
      variant="outlined"
      onClick={onClick}
    />
  );
};

export default ColorSwatch;
