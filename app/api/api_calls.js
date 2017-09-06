import passportCalls from "./passport_calls.js";
import editorCalls from "./editor_calls.js";
import edgeCalls from "./edge_calls.js";
import providerCalls from "./provider_calls.js";
import cmsTopicCalls from "./cmsTopic_calls.js";
import cmsAdCalls from "./cmsAd_calls.js";

const ApiCalls = Object.assign({}, passportCalls, editorCalls, edgeCalls, providerCalls, cmsTopicCalls, cmsAdCalls);

export default ApiCalls;
