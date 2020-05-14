import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useCategoriesQuery } from '../graphql';
import Link from './Link';

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginBottom: 24,
  },

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

const Categories: React.FC = () => {
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
                    underline="none"
                    href="/product-category/[slug]"
                    as={`/product-category/${category.slug}`}
                  >
                    <img
                      className={styles.categoryImage}
                      src={category.image?.srcSet ?? undefined}
                      srcSet={category.image?.sourceUrl ?? undefined}
                      alt={category.image?.altText ?? ''}
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
