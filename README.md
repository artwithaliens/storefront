# Art With Aliens :alien:

This is a React theme for WordPress, built with Next.js, Webpack, Babel, Node.

## Live demo site.

[Live Demo](https://artwithaliens.com)

## Getting Started :surfer:

These instructions will get you a copy of the project up and running on your local machine for
development purposes.

### Installing :wrench:

1. Clone this repo in `git@github.com:artwithaliens/storefront.git`
2. `cd storefront`
3. `yarn install`

## Configure Backend (WordPress site) :wrench:

### 1. Add GraphQl support on WordPress

1. Clone and activate the following plugins, in your WordPress plugin directory:

   - [wp-graphql](https://github.com/wp-graphql/wp-graphql) Exposes graphql for WordPress
   - [wp-graphql-jwt-authentication](https://github.com/wp-graphql/wp-graphql-jwt-authentication)
     This plugin extends the [wp-graphql](https://github.com/wp-graphql/wp-graphql) plugin to
     provide authentication using JWT.
   - [wp-graphql-woocommerce](https://github.com/wp-graphql/wp-graphql-woocommerce) Adds Woocommerce
     functionality to a WPGraphQL schema
   - [wp-graphql-yoast-seo](https://github.com/ashhitch/wp-graphql-yoast-seo) Adds SEO data to
     WPGraphQL schema

2. You can also import default wooCommerce products that come with wooCommerce Plugin for
   development ( if you don't have any products in your WordPress install ) WP Dashboard > Tools >
   WooCommerce products(CSV) : The WooCommerce default products csv file is available at
   `wp-content/plugins/woocommerce/sample-data/sample_products.csv`

### 2. For Authentication.

a. You can use any secret token of your choice, however it would be best if you generate one using
WordPress Salt generator (https://api.wordpress.org/secret-key/1.1/salt/) to generate a Secret. And
just pick up any one of the token and add it in place of 'your-secret-token' below:

Define a Secret in `wp-config.php` of your WordPress directory:

```
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-secret-token');
```

b. Depending on your particular environment, you may have to research how to enable these headers,
but in Apache, you can do the following in your `.htaccess`:

```
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
```

## Configure Front end :wrench:

- Rename `.env.example` to `.env` and update your React Site URL

```ini
GRAPHQL_URL=http://wordpressSiteUrl/graphql
```

## Commands :computer:

- `dev` Runs the node server in development mode

## Using PWA on mobile

- Open the site in Chrome on your mobile and then click on add to home screen.
- It will be downloaded and saved as a Progressive Web App on your mobile.
- Once added look `Art With Aliens` app on your mobile.
- This PWA will work even when you are offline.

## Branches Information: :seedling:

1. [master](https://github.com/artwithaliens/storefront/tree/master) Main React WooCommerce theme
2. [develop](https://github.com/artwithaliens/storefront/tree/develop) For testing

## Author

- [Eike Foken](https://eikefoken.com)

## License :page_with_curl:

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
