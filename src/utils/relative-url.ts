export default function relativeURL(url: string) {
  return url === '/' ? url : url.replace(/^(?:\/\/|[^/]+)*\//, '/').replace(/\/$/, '');
}
