import { get, slice } from 'lodash';

export type InstagramMedia = {
  id: string;
  displayImage: string;
  thumbnail: string;
  likes: number;
  caption: string;
  commentsNumber: number;
  accessibilityCaption?: string;
  dimensions: { width: number; height: number };
  postLink: string;
};

export default async function getInstagramFeedInfo(
  options: {
    numberOfMediaElements: number;
    discardVideos: boolean;
  } = {
    numberOfMediaElements: 6,
    discardVideos: false,
  },
): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accountInfo: any;
  accountFollowedBy: number;
  accountFollow: number;
  postsCount: number;
  profilePicture: string;
  accountName: string;
  media: InstagramMedia[];
}> {
  let media: InstagramMedia[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let accountInfo: any = {};

  try {
    const userInfoSource = await (await fetch('https://www.instagram.com/artwithaliens/')).text();

    const jsonObject = userInfoSource
      .match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)?.[1]
      .slice(0, -1);

    accountInfo = get(JSON.parse(jsonObject ?? '{}'), 'entry_data.ProfilePage[0].graphql.user');

    // Retrieve media info
    const mediaArray = slice<{ node: { __typename: string } }>(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      accountInfo.edge_owner_to_timeline_media.edges,
      0,
      options.numberOfMediaElements,
    );

    media = mediaArray
      // Process only if is an image
      .filter(({ node }) => !(options.discardVideos && node.__typename !== 'GraphImage'))
      .map(({ node }) => ({
        id: get(node, 'id'),
        displayImage: get(node, 'display_url'),
        thumbnail: get(node, 'thumbnail_resources[3].src'),
        likes: get(node, 'edge_liked_by.count'),
        caption: get(node, 'edge_media_to_caption.edges[0].node.text'),
        commentsNumber: get(node, 'edge_media_to_comment.count'),
        accessibilityCaption: get(node, 'accessibility_caption'),
        dimensions: get(node, 'dimensions'),
        postLink: `https://www.instagram.com/p/${get(node, 'shortcode')}/`,
      }));
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    throw new Error(`Unable to retrieve info. Reason: ${error.toString()}`);
  }

  return {
    accountInfo,
    accountFollowedBy: get(accountInfo, 'edge_followed_by.count'),
    accountFollow: get(accountInfo, 'edge_follow.count'),
    postsCount: get(accountInfo, 'edge_owner_to_timeline_media.count'),
    profilePicture: get(accountInfo, 'profile_pic_url_hd'),
    accountName: get(accountInfo, 'username'),
    media,
  };
}
