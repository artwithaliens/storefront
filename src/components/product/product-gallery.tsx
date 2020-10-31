import { Hidden, makeStyles, MobileStepper } from '@material-ui/core';
import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { ProductQuery } from '../../graphql';
import Image from '../core/image';

const useStyles = makeStyles(
  ({ spacing }) => ({
    gallery: {
      display: 'flex',
      flexDirection: 'column',
    },

    galleryStepper: {
      flexGrow: 1,
    },

    galleryStepperImage: {
      display: 'block',
      overflow: 'hidden',
      width: '100%',
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

const ProductGallery: React.VFC<Props> = ({ product }) => {
  const styles = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <Hidden mdUp>
        <div className={styles.galleryStepper}>
          <SwipeableViews
            enableMouseEvents
            axis="x"
            index={activeStep}
            onChangeIndex={(index) => setActiveStep(index)}
          >
            <div>
              <Image className={styles.galleryStepperImage} mediaItem={product.image} />
            </div>
            {product.galleryImages?.nodes?.map(
              (mediaItem) =>
                mediaItem != null && (
                  <div key={mediaItem.id}>
                    <Image className={styles.galleryStepperImage} mediaItem={mediaItem} />
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
      <Hidden mdDown>
        <div className={styles.gallery}>
          <Image className={styles.galleryImage} mediaItem={product.image} />
          {product.galleryImages?.nodes?.map(
            (mediaItem) =>
              mediaItem != null && (
                <Image key={mediaItem.id} className={styles.galleryImage} mediaItem={mediaItem} />
              ),
          )}
        </div>
      </Hidden>
    </>
  );
};

export default ProductGallery;
