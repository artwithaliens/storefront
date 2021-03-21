export type InstagramMedia = {
  accessibilityCaption?: string;
  caption?: string;
  commentsNumber?: number;
  dimensions?: { height?: number; width?: number };
  displayImage?: string;
  id: string;
  likes?: number;
  postLink: string;
  thumbnail?: string;
};

export default async function fetchInstagramMedia(): Promise<InstagramMedia[]> {
  return (await fetch('/api/instagram')).json() as Promise<InstagramMedia[]>;
}
