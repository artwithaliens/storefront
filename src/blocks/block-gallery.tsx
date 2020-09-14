import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(
  ({ breakpoints, spacing }) => ({
    root: {
      '&, .blocks-gallery-grid': {
        display: 'flex',
        flexWrap: 'wrap',
        listStyleType: 'none',
        margin: 0,
        padding: 0,

        '& .blocks-gallery-image, & .blocks-gallery-item': {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'center',
          margin: spacing(0, 2, 2, 0),
          position: 'relative',

          // On mobile and responsive viewports, we allow only 1 or 2 columns at the most.
          [breakpoints.down('xs')]: {
            width: `calc(50% - ${spacing(2)}px)`,

            '&:nth-of-type(even)': {
              marginRight: 0,
            },
          },

          // Last item always needs margins reset.
          '&:last-child': {
            marginRight: 0,
          },

          '& figure': {
            alignItems: 'flex-end',
            display: 'flex',
            height: '100%',
            justifyContent: 'flex-start',
            margin: 0,
          },
        },

        '& .blocks-gallery-image img, & .blocks-gallery-item img': {
          display: 'block',
          height: 'auto',
          maxWidth: '100%',
          width: 'auto',
        },

        '&.is-cropped .blocks-gallery-image, &.is-cropped .blocks-gallery-item': {
          '& a, & img': {
            flex: 1,
            height: '100%',
            objectFit: 'cover',
            width: '100%',
          },
        },

        '&.columns-1 .blocks-gallery-image, &.columns-1 .blocks-gallery-item': {
          marginRight: 0,
          width: '100%',
        },

        ...Object.assign(
          {},
          // Beyond mobile viewports, we allow up to 8 columns.
          ...[3, 4, 5, 6, 7, 8].map((i) => ({
            [`&.columns-${i} .blocks-gallery-image, &.columns-${i} .blocks-gallery-item`]: {
              [breakpoints.up('sm')]: {
                marginRight: spacing(2),
                width: `calc(${100 / i}% - ${(spacing(2) * (i - 1)) / i}px)`,
              },
            },
          })),

          // Unset the right margin on every rightmost gallery item to ensure center balance.
          ...[1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
            [`&.columns-${i} .blocks-gallery-image:nth-of-type(${i}n), &.columns-${i} .blocks-gallery-item:nth-of-type(${i}n)`]: {
              [breakpoints.up('sm')]: {
                marginRight: 0,
              },
            },
          })),
        ),

        // Apply max-width to floated items that have no intrinsic width.
        '&.alignleft, &.alignright': {
          maxWidth: breakpoints.values.lg / 2,
          width: '100%',
        },

        // If the gallery is centered, center the content inside as well.
        '&.aligncenter': {
          '& .blocks-gallery-item figure': {
            justifyContent: 'center',
          },
        },
      },
    },
  }),
  { name: 'BlockGallery' },
);

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const BlockGallery: React.FC<Props> = ({ children, className, style }) => {
  const styles = useStyles();

  return (
    <div className={clsx(styles.root, className)} style={style}>
      {children}
    </div>
  );
};

export default BlockGallery;
