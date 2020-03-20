import { makeStyles, MobileStepper } from '@material-ui/core';
import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { ProductQuery } from '../../graphql';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      flexGrow: 1,
    },

    image: {
      display: 'block',
      overflow: 'hidden',
      width: '100%',
    },
  }),
  { name: 'GalleryStepper' },
);

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const GalleryStepper: React.FC<Props> = ({ product }) => {
  const styles = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className={styles.root}>
      <SwipeableViews
        enableMouseEvents
        axis="x"
        index={activeStep}
        onChangeIndex={(index) => setActiveStep(index)}
      >
        <div>
          <img
            className={styles.image}
            src={product.image?.sourceUrl ?? undefined}
            srcSet={product.image?.srcSet ?? undefined}
            alt={product.image?.altText ?? ''}
          />
        </div>
        {product.galleryImages?.nodes?.map(
          (mediaItem) =>
            mediaItem != null && (
              <div key={mediaItem.id}>
                <img
                  className={styles.image}
                  src={mediaItem.sourceUrl ?? undefined}
                  srcSet={mediaItem.srcSet ?? undefined}
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
  );
};

export default GalleryStepper;
