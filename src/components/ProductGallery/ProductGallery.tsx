import { Hidden, makeStyles, MobileStepper } from '@material-ui/core';
import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { ProductQuery } from '../../graphql';

const useStyles = makeStyles(
  ({ spacing }) => ({
    stepper: {
      flexGrow: 1,
    },

    stepperImage: {
      display: 'block',
      overflow: 'hidden',
      width: '100%',
    },

    gallery: {
      display: 'flex',
      flexDirection: 'column',
    },

    galleryImage: {
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
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <Hidden mdUp>
        <div className={styles.stepper}>
          <SwipeableViews
            enableMouseEvents
            axis="x"
            index={activeStep}
            onChangeIndex={(index) => setActiveStep(index)}
          >
            <div>
              <img
                className={styles.stepperImage}
                src={product.image?.sourceUrl ?? undefined}
                srcSet={product.image?.srcSet ?? undefined}
                sizes={product.image?.sizes ?? undefined}
                alt={product.image?.altText ?? ''}
              />
            </div>
            {product.galleryImages?.nodes?.map(
              (mediaItem) =>
                mediaItem != null && (
                  <div key={mediaItem.id}>
                    <img
                      className={styles.stepperImage}
                      src={mediaItem.sourceUrl ?? undefined}
                      srcSet={mediaItem.srcSet ?? undefined}
                      sizes={mediaItem.sizes ?? undefined}
                      alt={mediaItem.altText ?? ''}
                    />
                  </div>
                ),
            )}
          </SwipeableViews>
          <MobileStepper
            steps={(product.galleryImages?.nodes?.length ?? 0) + 1}
            variant="dots"
            position="static"
            activeStep={activeStep}
            nextButton={<div />}
            backButton={<div />}
          />
        </div>
      </Hidden>
      <Hidden smDown>
        <div className={styles.gallery}>
          <img
            className={styles.galleryImage}
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
                  className={styles.galleryImage}
                  src={mediaItem.sourceUrl ?? undefined}
                  srcSet={mediaItem.srcSet ?? undefined}
                  sizes={mediaItem.sizes ?? undefined}
                  alt={mediaItem.altText ?? ''}
                />
              ),
          )}
        </div>
      </Hidden>
    </>
  );
};

export default ProductGallery;
