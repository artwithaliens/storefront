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

export default async function fetchInstagramMedia(
  options: {
    discardVideos: boolean;
    numberOfMediaElements: number;
  } = {
    discardVideos: false,
    numberOfMediaElements: 6,
  },
): Promise<InstagramMedia[]> {
  const html = await (await fetch('https://www.instagram.com/artwithaliens/')).text();

  const sharedData: {
    entry_data?: {
      ProfilePage?: {
        graphql?: {
          user?: {
            edge_owner_to_timeline_media?: {
              edges?: {
                node: {
                  __typename: string;
                  accessibility_caption?: string;
                  dimensions?: { height?: number; width?: number };
                  display_url?: string;
                  edge_liked_by?: { count?: number };
                  edge_media_to_caption?: { edges?: { node?: { text?: string } }[] };
                  edge_media_to_comment?: { count?: number };
                  id: string;
                  shortcode?: string;
                  thumbnail_resources?: { src?: string }[];
                };
              }[];
            };
          };
        };
      }[];
    };
  } = JSON.parse(
    html.match(/<script type="text\/javascript">window\._sharedData = (.*);<\/script>/)?.[1] ??
      '{}',
  );

  return (
    // Retrieve media info
    sharedData.entry_data?.ProfilePage?.[0]?.graphql?.user?.edge_owner_to_timeline_media?.edges
      ?.slice(0, options.numberOfMediaElements)
      // Process only if is an image
      ?.filter(({ node }) => !(options.discardVideos && node.__typename !== 'GraphImage'))
      ?.map(({ node }) => ({
        accessibilityCaption: node.accessibility_caption,
        caption: node.edge_media_to_caption?.edges?.[0]?.node?.text,
        commentsNumber: node.edge_media_to_comment?.count,
        dimensions: node.dimensions,
        displayImage: node.display_url,
        id: node.id,
        likes: node.edge_liked_by?.count,
        postLink: `https://www.instagram.com/p/${node.shortcode}/`,
        thumbnail: node.thumbnail_resources?.[2].src,
      })) ?? []
  );
}
