import { Image } from '@components/core';
import { Link } from '@components/ui';
import { Box, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useCategoriesQuery } from '../../graphql';

const useStyles = makeStyles({
  category: {
    display: 'block',
    height: '100%',
    textDecoration: 'none',
  },

  categoryImage: {
    height: 430,
    objectFit: 'cover',
    verticalAlign: 'middle',
    width: '100%',
  },
});

const CategoryGrid: React.VFC = () => {
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
                <Link
                  className={styles.category}
                  href={`/product-category/${category.slug}`}
                  underline="none"
                >
                  <Image
                    className={styles.categoryImage}
                    mediaItem={category.image}
                    next={false}
                    loading="lazy"
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h4">{category.name}</Typography>
                  </Box>
                </Link>
              </Grid>
            ),
        )}
      </Grid>
    </Container>
  );
};

export default CategoryGrid;
