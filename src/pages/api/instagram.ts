import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  accessibilityCaption?: string;
  caption?: string;
  commentsNumber?: number;
  dimensions?: { height?: number; width?: number };
  displayImage?: string;
  id: string;
  likes?: number;
  postLink: string;
  thumbnail?: string;
}[];

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  fetch('https://www.instagram.com/artwithaliens/')
    // eslint-disable-next-line promise/prefer-await-to-then
    .then((response) => response.text())
    // eslint-disable-next-line promise/prefer-await-to-then
    .then((text) => {
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
        text.match(/<script type="text\/javascript">window\._sharedData = (.*);<\/script>/)?.[1] ??
          '{}',
      );

      res.status(200).json(
        sharedData.entry_data?.ProfilePage?.[0]?.graphql?.user?.edge_owner_to_timeline_media?.edges
          ?.slice(0, req.body.numberOfMediaElements ?? 6)
          // Process only if is an image
          ?.filter(({ node }) => !(req.body.discardVideos && node.__typename !== 'GraphImage'))
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
          })) ?? [],
      );
    });
};
