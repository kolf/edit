import Types from "app/action_types";
import Calls from "app/api/api_calls";

export default Object.keys(Types).reduce((result, type) => {
  const fn = type.toLowerCase().replace(/(\_[a-z])/g, s => s[1].toUpperCase());
  
  result[fn] = (params, t) => {
    return {
      type: Types[type],
      callAPI: () => Calls[fn](params, t)
    }
  };
  
  return result;
}, {})
