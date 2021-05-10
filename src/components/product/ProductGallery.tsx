import { Image } from '@components/core';
import { makeStyles, MobileStepper, Theme, useMediaQuery } from '@material-ui/core';
import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { ProductQuery } from '../../graphql';

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
      margin: spacing(0, 0, 1),
      position: 'relative',

      '& img': {
        display: 'block',
        height: 'auto',
        maxWidth: '100%',
      },

      '& figcaption': {
        backgroundColor: '#000',
        float: 'right',
        marginTop: -24,
        position: 'relative',
      },
    },
  }),
  { name: 'ProductGallery' },
);

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const ProductGallery: React.VFC<Props> = ({ product }) => {
  const styles = useStyles();
  const mobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  const [activeStep, setActiveStep] = useState(0);

  return mobile ? (
    <div className={styles.galleryStepper}>
      <SwipeableViews
        enableMouseEvents
        axis="x"
        index={activeStep}
        onChangeIndex={(index) => setActiveStep(index)}
      >
        <div>
          <Image className={styles.galleryStepperImage} mediaItem={product.image} next={false} />
        </div>
        {product.galleryImages?.nodes?.map(
          (mediaItem) =>
            mediaItem != null && (
              <div key={mediaItem.id}>
                <Image className={styles.galleryStepperImage} mediaItem={mediaItem} next={false} />
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
  ) : (
    <div className={styles.gallery}>
      <figure className={styles.galleryImage}>
        <Image mediaItem={product.image} next={false} />
        <figcaption>{product.image?.caption}</figcaption>
      </figure>
      {product.galleryImages?.nodes?.map(
        (mediaItem) =>
          mediaItem != null && (
            <figure className={styles.galleryImage}>
              <Image key={mediaItem.id} mediaItem={mediaItem} next={false} />
              <figcaption>{mediaItem.caption}</figcaption>
            </figure>
          ),
      )}
    </div>
  );
};

export default ProductGallery;
