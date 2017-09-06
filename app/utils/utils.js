// 从数组中过滤值, 当type为flase时，返回共同的项
const uniq = (arr, values, key, type = true) => {
  const vals = values.map(item => item[key]);
  return arr.filter(item => {
    return type
      ? vals.indexOf(item[key]) == -1
      : vals.indexOf(item[key]) != -1;
  });
};

const compareArr = (arr1, arr2) => {
  if (!arr1 || !arr2 || arr1.length != arr2.length) {
    return false;
  } else {
    return arr1.every((item, index) => {
      return JSON.stringify(item) == JSON.stringify(arr2[index])
    })
  }
};

const isEmptyObj = (obj) => {
  let flag = true;
  for (let name in obj) {
    if (obj[name]) {
      flag = false
    }
  }
  return flag
};

const isElite = (arr) => { //判断组照是否是精选
  const eliteArr = [
    '9462',
    '5999',
    '6182',
    '745',
    '10494',
    '11482',
    '14953'
  ];
  return arr.some(item => eliteArr.indexOf(item + '') != -1);
};

const isEn = () => /\/en\//.test(window.location.pathname); // 判断是不是英文版

const decode = (str) => {
  if (!str)
    return '';
  try {
    return decodeURIComponent(str)
  } catch (e) {
    return str
  }
};

const queryUrl = (name) => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  const r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
};

const unescapeHtml = (str) => {
  return str
    .replace("&amp;", '&')
    .replace("&lt;", '<')
    .replace("&gt;", '>')
    .replace("&quot;", '"')
    .replace("&#039;", "'")
}

// isEnv('dev|prod')
const isEnv = (env) => { // 判断是什么环境
  const {href} = window.location;
  if (env == 'dev' && /\d{3}/.test(href)) {
    return true
  } else {
    return href.indexOf(env + '.') != -1
  }
}

const getStrLength = (str) => {
  str = str || '';
  let _zh = str
    ? str.match(/[^ -~]/g)
    : 0;
  return Math.ceil((str.length + (_zh && _zh.length) || 0) / 2);
};

/**
 * 判断屏幕宽度，依次加载相应DOM个数
 * @returns {string}
 */

const getDevice = () => {
  const dimensionMap = {
    xs: '480px',
    sm: '768px',
    md: '992px',
    xlg: '1400px'
  };
  
  let device = '';
  
  Object.keys(dimensionMap).forEach(key => {
    if (window.matchMedia('(min-width: ' + dimensionMap[key] + ')').matches) {
      device = key
    }
  });
  return device
};

export {
  uniq,
  isElite,
  isEn,
  decode,
  isEnv,
  unescapeHtml,
  getStrLength,
  compareArr,
  isEmptyObj,
  queryUrl,
  getDevice
}
