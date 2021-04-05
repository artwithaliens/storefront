import { Facebook, Github, Instagram } from '@components/icons';
import { Link, Logo } from '@components/ui';
import { Box, Container, Grid, IconButton, Stack, Typography } from '@material-ui/core';
import React from 'react';
import { MenuLocationEnum, useMenuQuery } from '../../../graphql';
import relativeURL from '../../../utils/relativeURL';

const Footer: React.VFC = () => {
  const { data: menu } = useMenuQuery({
    variables: { location: MenuLocationEnum.FOOTER_NAVIGATION },
  });

  return (
    <Box component="footer" sx={{ bgcolor: 'common.black' }}>
      <Container sx={{ overflow: 'hidden' }}>
        <Grid container spacing={4} sx={{ my: 6 }}>
          <Grid item xs={12} md={2}>
            <Logo />
          </Grid>
          {menu?.menuItems?.nodes?.map(
            (menuItem) =>
              menuItem != null &&
              (menuItem.childItems?.nodes?.length ?? 0) > 0 && (
                <Grid key={menuItem.id} item xs={12} md={2}>
                  <Typography variant="h4">{menuItem.label}</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, my: 2 }}>
                    {menuItem.childItems?.nodes?.map(
                      (childItem) =>
                        childItem != null && (
                          <Box key={childItem.id} component="li" sx={{ mb: 2 }}>
                            <Link href={relativeURL(childItem.url ?? '/')} variant="body1">
                              <span
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{ __html: childItem.label ?? '' }}
                              />
                            </Link>
                          </Box>
                        ),
                    )}
                  </Box>
                </Grid>
              ),
          )}
          <Grid item xs={12} md={6} sx={{ ml: 'auto' }}>
            <Stack
              direction="row"
              justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
              spacing={{ xs: 1, md: 3 }}
            >
              <IconButton
                href="https://www.facebook.com/artwithaliens"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="Facebook"
              >
                <Facebook fontSize="large" />
              </IconButton>
              <IconButton
                href="https://www.instagram.com/artwithaliens/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="Instagram"
              >
                <Instagram fontSize="large" />
              </IconButton>
              <IconButton
                href="https://github.com/artwithaliens"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="GitHub"
              >
                <Github fontSize="large" />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ my: 6 }}>
          <Typography align="center">
            Copyright © 2018-{new Date().getFullYear()}{' '}
            <Link href="https://artwithaliens.com" target="_blank" rel="noopener noreferrer">
              Art With Aliens
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
