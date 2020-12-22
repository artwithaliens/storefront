import { Box, GridDirection, GridSpacing, GridWrap } from '@material-ui/core';
import React, { useMemo } from 'react';

export type StackProps = React.HTMLAttributes<HTMLDivElement> & {
  alignItems?: React.CSSProperties['alignItems'];
  direction?: GridDirection;
  justifyContent?: React.CSSProperties['justifyContent'];
  shouldWrapChildren?: boolean;
  spacing?: GridSpacing;
  wrap?: GridWrap;
};

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      alignItems,
      children,
      direction = 'row',
      justifyContent,
      shouldWrapChildren,
      spacing = 1,
      wrap,
      ...props
    },
    ref,
  ) => {
    const styles = useMemo(
      () =>
        ({
          row: { ml: spacing, mt: 0 },
          'row-reverse': { mr: spacing, mb: 0 },
          column: { mt: spacing, ml: 0 },
          'column-reverse': { mb: spacing, mr: 0 },
        }[direction]),
      [direction, spacing],
    );

    return (
      <Box
        ref={ref}
        sx={{
          alignItems,
          display: 'flex',
          flexDirection: direction,
          flexWrap: wrap,
          justifyContent,

          '& > *:not(style) ~ *:not(style)': styles,
        }}
        {...props}
      >
        {React.Children.toArray(children)
          .filter((child) => React.isValidElement(child))
          .map((child, index) =>
            shouldWrapChildren ? (
              <Box
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                sx={{
                  display: 'inline-block',
                  flex: '0 0 auto',
                  minWidth: 0,
                }}
              >
                {child}
              </Box>
            ) : (
              child
            ),
          )}
      </Box>
    );
  },
);

export default Stack;
