export default function absoluteURL(url: string) {
  return `${process.env.VERCEL_URL}${url}`;
}
