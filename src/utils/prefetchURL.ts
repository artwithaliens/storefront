import relativeURL from './relativeURL';

export default function prefetchURL(url: string) {
  const asPath = relativeURL(url);

  return asPath === '/' ||
    asPath.match(/^\/(cart|checkout|contact|login|my-account|order-confirmation|register|shop)/)
    ? asPath
    : asPath.match(/product\//)
    ? '/product/[slug]'
    : asPath.match(/product-category\//)
    ? '/product-category/[slug]'
    : asPath.match(/product-tag\//)
    ? '/product-tag/[slug]'
    : '/[slug]';
}
