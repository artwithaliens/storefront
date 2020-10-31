import { Image } from '@components/core';
import { Link } from '@components/ui';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useCategoriesQuery } from '../../graphql';

const useStyles = makeStyles(({ spacing }) => ({
  category: {
    height: '100%',
  },

  categoryLink: {
    display: 'block',
    textDecoration: 'none',
  },

  categoryImage: {
    height: 430,
    objectFit: 'cover',
    verticalAlign: 'middle',
    width: '100%',
  },

  categoryTitle: {
    marginTop: spacing(2),
  },
}));

const Categories: React.VFC = () => {
  const styles = useStyles();

  const { data: { categories } = { data: { categories: undefined } } } = useCategoriesQuery();

  return (
    <Container>
      <Typography gutterBottom variant="h3">
        Shop by category
      </Typography>
      <Grid container spacing={4}>
        {categories?.nodes?.map(
          (category) =>
            category != null && (
              <Grid key={category.id} item xs={12} md={6}>
                <div className={styles.category}>
                  <Link
                    className={styles.categoryLink}
                    href={`/product-category/${category.slug}`}
                    underline="none"
                  >
                    <Image
                      className={styles.categoryImage}
                      mediaItem={category.image}
                      loading="lazy"
                    />
                    <Typography variant="h4" className={styles.categoryTitle}>
                      {category.name}
                    </Typography>
                  </Link>
                </div>
              </Grid>
            ),
        )}
      </Grid>
    </Container>
  );
};

export default Categories;
