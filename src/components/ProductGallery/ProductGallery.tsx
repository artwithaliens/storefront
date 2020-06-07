import { makeStyles } from '@material-ui/core';
import React from 'react';
import { ProductQuery } from '../../graphql';

const useStyles = makeStyles(
  ({ spacing }) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },

    image: {
      height: 'auto',
      marginBottom: spacing(1),
      maxWidth: '100%',
    },
  }),
  { name: 'ProductGallery' },
);

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const ProductGallery: React.FC<Props> = ({ product }) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <img
        className={styles.image}
        src={product.image?.sourceUrl ?? undefined}
        srcSet={product.image?.srcSet ?? undefined}
        sizes={product.image?.sizes ?? undefined}
        alt={product.image?.altText ?? ''}
      />
      {product.galleryImages?.nodes?.map(
        (mediaItem) =>
          mediaItem != null && (
            <img
              key={mediaItem.id}
              className={styles.image}
              src={mediaItem.sourceUrl ?? undefined}
              srcSet={mediaItem.srcSet ?? undefined}
              sizes={mediaItem.sizes ?? undefined}
              alt={mediaItem.altText ?? ''}
            />
          ),
      )}
    </div>
  );
};

export default ProductGallery;
