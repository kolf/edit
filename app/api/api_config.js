import {NODE_ENV} from "app/utils/env";

const [passportUrl, editorUrl, edgeUrl, cmsTopicUrl, cmsAdUrl, providerUrl] = ['passport', 'editor', 'edge', 'cmsTopic', 'cmsAd', 'provider'].map(key => `/${key}`);

export {
  passportUrl,
  editorUrl,
  edgeUrl,
  cmsTopicUrl,
  cmsAdUrl,
  providerUrl
}
