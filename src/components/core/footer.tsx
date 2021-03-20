import { Facebook, Github, Instagram } from '@components/icons';
import { Link } from '@components/ui';
import { Box, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';
import { MenuLocationEnum, useMenuQuery } from '../../graphql';
import fetchInstagramMedia from '../../utils/fetchInstagramMedia';
import relativeURL from '../../utils/relativeURL';

const useStyles = makeStyles(
  ({ spacing, palette, breakpoints, typography }) => ({
    root: {
      backgroundColor: palette.common.black,
    },

    socialLink: {
      color: palette.primary.main,
      marginLeft: spacing(1),
      marginRight: spacing(1),

      [breakpoints.up('md')]: {
        marginLeft: spacing(3),
        marginRight: spacing(3),
      },
    },

    feedImage: {
      height: '100%',
      objectFit: 'cover',
      verticalAlign: 'middle',
      width: '100%',
    },

    menu: {
      listStyle: 'none',
      margin: spacing(2, 0),
      padding: 0,
    },

    menuItem: {
      ...typography.body1,

      '& a': {
        display: 'block',
        paddingBottom: 2,
        paddingTop: 2,
      },
    },

    copyright: {
      paddingBottom: spacing(2),
      paddingTop: spacing(2),
    },
  }),
  { name: 'Footer' },
);

const Footer: React.VFC = () => {
  const styles = useStyles();

  const { data: menu } = useMenuQuery({
    variables: { location: MenuLocationEnum.FOOTER_NAVIGATION },
  });

  const { value: instagramMedia } = useAsync(fetchInstagramMedia);

  return (
    <footer className={styles.root}>
      <Container>
        <Box sx={{ pb: 3, pt: 6, textAlign: 'center' }}>
          <a
            href="https://www.facebook.com/artwithaliens"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Facebook"
          >
            <Facebook fontSize="large" />
          </a>
          <a
            href="https://www.instagram.com/artwithaliens/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Instagram"
          >
            <Instagram fontSize="large" />
          </a>
          <a
            href="https://github.com/artwithaliens"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="GitHub"
          >
            <Github fontSize="large" />
          </a>
        </Box>
        {instagramMedia != null && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={1}>
              {instagramMedia.map((medium) => (
                <Grid key={medium.id} item xs={4} sm={2}>
                  <a href={medium.postLink} target="_blank" rel="noopener noreferrer">
                    <img
                      className={styles.feedImage}
                      src={medium.thumbnail}
                      alt={medium.accessibilityCaption ?? ''}
                      loading="lazy"
                    />
                  </a>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <Grid container spacing={4}>
          {menu?.menuItems?.nodes?.map(
            (menuItem) =>
              menuItem != null &&
              (menuItem.childItems?.nodes?.length ?? 0) > 0 && (
                <Grid key={menuItem.id} item xs={6} md="auto">
                  <Typography variant="h4">{menuItem.label}</Typography>
                  <ul className={styles.menu}>
                    {menuItem.childItems?.nodes?.map(
                      (childItem) =>
                        childItem != null && (
                          <li key={childItem.id} className={styles.menuItem}>
                            <Link href={relativeURL(childItem.url ?? '/')}>
                              <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{ __html: childItem.label ?? '' }}
                              />
                            </Link>
                          </li>
                        ),
                    )}
                  </ul>
                </Grid>
              ),
          )}
        </Grid>
      </Container>
      <Typography component="div" align="center" className={styles.copyright}>
        Copyright © 2018-{new Date().getFullYear()}{' '}
        <Link href="https://artwithaliens.com" target="_blank" rel="noopener noreferrer">
          Art With Aliens
        </Link>
      </Typography>
    </footer>
  );
};

export default Footer;
