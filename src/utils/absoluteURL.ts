export default function absoluteURL(url: string) {
  return `${process.env.SITE_URL}${url}`;
}
