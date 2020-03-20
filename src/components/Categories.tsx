import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

const useStyles = makeStyles({
  title: {
    marginBottom: 24,
  },

  categoryTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.222,
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'center',
  },
});

const Categories: React.FC = () => {
  const styles = useStyles();

  return (
    <Container>
      <Typography variant="h2" align="center" className={styles.title}>
        Shop by Category
      </Typography>
      <Grid container component="ul" spacing={3}>
        <Grid item component="li" md={4}>
          <Link href="/">
            <a>
              <img
                src="https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/accessories.jpg"
                alt="Accessories"
                width="324"
                height="324"
                srcSet="https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/accessories.jpg 801w, https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/accessories-150x150.jpg 150w, https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/accessories-300x300.jpg 300w, https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/accessories-768x768.jpg 768w"
                sizes="(max-width: 324px) 100vw, 324px"
              />
              <Typography variant="h3" className={styles.categoryTitle}>
                Accessories <mark className="count">(4)</mark>
              </Typography>
            </a>
          </Link>
        </Grid>
        <Grid item component="li" md={4}>
          <Link href="/">
            <a>
              <img
                src="https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/hoodies.jpg"
                alt="Hoodies"
                width="324"
                height="324"
                srcSet="https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/hoodies.jpg 800w, https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/hoodies-150x150.jpg 150w, https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/hoodies-300x300.jpg 300w, https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/hoodies-768x768.jpg 768w"
                sizes="(max-width: 324px) 100vw, 324px"
              />
              <Typography variant="h3" className={styles.categoryTitle}>
                Hoodies <mark className="count">(4)</mark>
              </Typography>
            </a>
          </Link>
        </Grid>
        <Grid item component="li" md={4}>
          <Link href="/">
            <a>
              <img
                src="https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/tshirts.jpg"
                alt="Tshirts"
                width="324"
                height="324"
                srcSet="https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/tshirts.jpg 801w, https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/tshirts-150x150.jpg 150w, https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/tshirts-300x300.jpg 300w, https://woo-vsf.dev5.rt.gw/wp-content/uploads/2019/05/tshirts-768x768.jpg 768w"
                sizes="(max-width: 324px) 100vw, 324px"
              />
              <Typography variant="h3" className={styles.categoryTitle}>
                T-Shirts <mark className="count">(4)</mark>
              </Typography>
            </a>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Categories;
