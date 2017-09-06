import Types from "app/action_types";

import {
  cmsTopicStatus as cmsTopicStatusCall,
  cmsFilter as cmsFilterCall,
  cmsSearch as cmsSearchCall,
  topicFrequency as topicFrequencyCall,
  topicCfg  as topicCfgCall,
  cmsChannelList as cmsChannelListCall,
  channelCfg as channelCfgCall,
  scrollList as scrollListCall,
  picList as picListCall,
  cmsContentFilter as cmsContentFilterCall,
  cmsContentSearch as cmsContentSearchCall,
  getBasicInfo as getBasicInfoCall,
  saveBasicInfo as saveBasicInfoCall,
  bsFetch as bsFetchCall,
  saveFetch as saveFetchCall,
  feFilter as feFilterCall,
  saveFilter as saveFilterCall,
  publicTopic as publicTopicCall,
  tagData as tagDataCall,
  deleteTag as deleteTagCall,
  deletePic as deletePicCall,
  tagPicList as tagPicListCall,
  adPicList as adPicListCall,
  deleteAdPic as deleteAdPicCall,
  publicAd as publicAdCall,
  picInfo as picInfoCall,
  recommendPicList as recommendPicListCall,
  publicRecommend as publicRecommendCall,
  cmsGetChildFilter as cmsGetChildFilterCall,
  cmsSaveLinkageFilter as cmsSaveLinkageFilterCall,
  cmsDeleteLinkageFilter as cmsDeleteLinkageFilterCall,
  cmsSaveLinkageFilterTag as cmsSaveLinkageFilterTagCall
} from "app/api/api_calls";

export function cmsTopicStatus(params) {
  return {
    type: Types.CMSTOPICSTATUS,
    callAPI: () => cmsTopicStatusCall(params)
  }
}

export function cmsFilter(params) {
  return {
    type: Types.CMSFILTER,
    callAPI: () => cmsFilterCall(params)
  }
}

export function cmsSearch(params) {
  return {
    type: Types.CMSSEARCH,
    callAPI: () => cmsSearchCall(params)
  }
}

export function topicFrequency(params) {
  return {
    type: Types.TOPICFREQUENCY,
    callAPI: () => topicFrequencyCall(params)
  }
}

export function topicCfg(params) {
  return {
    type: Types.TOPICCFG,
    callAPI: () => topicCfgCall(params)
  }
}

export function cmsChannelList(params) {
  return {
    type: Types.CMSCHANNELLIST,
    callAPI: () => cmsChannelListCall(params)
  }
}

export function channelCfg(params) {
  return {
    type: Types.CHANNELCFG,
    callAPI: () => channelCfgCall(params)
  }
}

export function picList(params) {
  return {
    type: Types.PICLIST,
    callAPI: () => picListCall(params)
  }
}

export function scrollList(params) {
  return {
    type: Types.SCROLLLIST,
    callAPI: () => scrollListCall(params)
  }
}

export function getBasicInfo(params) {
  return {
    type: Types.CHANNELCFG,
    callAPI: () => getBasicInfoCall(params)
  }
}

export function saveBasicInfo(params) {
  return {
    type: Types.SAVETOPIC,
    callAPI: () => saveBasicInfoCall(params)
  }
}

export function bsFetch(params) {
  return {
    type: Types.CHANNELCFG,
    callAPI: () => bsFetchCall(params)
  }
}

export function saveFetch(params) {
  return {
    type: Types.SAVETOPIC,
    callAPI: () => saveFetchCall(params)
  }
}

export function feFilter(params) {
  return {
    type: Types.CHANNELCFG,
    callAPI: () => feFilterCall(params)
  }
}

export function saveFilter(params) {
  return {
    type: Types.SAVETOPIC,
    callAPI: () => saveFilterCall(params)
  }
}

export function cmsContentFilter(params) {
  return {
    type: Types.CMSCONTENTFILTER,
    callAPI: () => cmsContentFilterCall(params)
  }
}

export function cmsContentSearch(params) {
  return {
    type: Types.CMSCONTENTSEARCH,
    callAPI: () => cmsContentSearchCall(params)
  }
}

export function publicTopic(params) {
  return {
    type: Types.SAVETOPIC,
    callAPI: () => publicTopicCall(params)
  }
}

export function tagData(params) {
  return {
    type: Types.TAGDATA,
    callAPI: () => tagDataCall(params)
  }
}

export function deleteTag(params) {
  return {
    type: Types.TAGDATA,
    callAPI: () => deleteTagCall(params)
  }
}

export function deletePic(params) {
  return {
    type: Types.DELETEPIC,
    callAPI: () => deletePicCall(params)
  }
}

export function tagPicList(params) {
  return {
    type: Types.TAGPICLIST,
    callAPI: () => tagPicListCall(params)
  }
}

export function adPicList(params) {
  return {
    type: Types.PICLIST,
    callAPI: () => adPicListCall(params)
  }
}

export function deleteAdPic(params) {
  return {
    type: Types.DELETEPIC,
    callAPI: () => deleteAdPicCall(params)
  }
}

export function publicAd(params) {
  return {
    type: Types.PUBLICAD,
    callAPI: () => publicAdCall(params)
  }
}

export function picInfo(params) {
  return {
    type: Types.PICINFO,
    callAPI: () => picInfoCall(params)
  }
}

export function recommendPicList(params) {
  return {
    type: Types.PICLIST,
    callAPI: () => recommendPicListCall(params)
  }
}

export function publicRecommend(params) {
  return {
    type: Types.PUBLICRECOMMEND,
    callAPI: () => publicRecommendCall(params)
  }
}
//cmsGetChildFilter
export function cmsGetChildFilter(params) {
  return {
    type: Types.CMSGETCHILDFILTER,
    callAPI: () => cmsGetChildFilterCall(params)
  }
}
export function cmsSaveLinkageFilter(params) {
  return {
    type: Types.CMSSAVELINKAGEFILTER,
    callAPI: () => cmsSaveLinkageFilterCall(params)
  }
}
export function cmsDeleteLinkageFilter(params) {
  return {
    type: Types.CMSDELETELINKAGEFILTER,
    callAPI: () => cmsDeleteLinkageFilterCall(params)
  }
}
export function cmsSaveLinkageFilterTag(params) {
  return {
    type: Types.CMSSAVELINKAGEFILTERTAG,
    callAPI: () => cmsSaveLinkageFilterTagCall(params)
  }
}