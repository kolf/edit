const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */];

export function email(value) {
  // Let's not start a de`bate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }
}

export function required(value) {
  if (isEmpty(value)) {
    return '此处必填';
  }
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `必须至少为 ${min} 字符`;
    }
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `必须不超过 ${max} 字符`;
    }
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return '必须是一个整数';
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
  }
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
  };
}

/*
 具体的匹配中文及字符方法：/[\u4E00-\u9FA5\uF900-\uFA2D]/
 说明： u4e00-u9fbf :  unicode CJK(中日韩)统一表意字符。u9fa5后至u9fbf为空
 uF900-uFAFF :  为unicode  CJK 兼容象形文字  。uFA2D后至uFAFF为空
 具体可参考unicode编码表：http://www.nengcha.com/code/unicode/class/
 */
export function zh(value) {
  const flag = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(value);
  if (!flag) {
    return '请输入中文字符';
  }
}

export function enNumber(value) {
  const flag = /^[a-zA-Z][0-9]+$/.test(value);
  if (!flag) {
    return '请输入英文字符';
  }
}

export function zhEn(value) {
  const flag = /^[\u4E00-\u9FA5\uF900-\uFA2D]|[a-zA-Z]+$/.test(value);
  if (!flag) {
    return '请输入中文或英文，不能包含数字和其他特殊字符';
  }
}

export function zhEnNumber(value) {
  const flag = /^[\u0391-\uFFE5]|[a-zA-Z]|[0-9]+$/.test(value);
  if (!flag) {
    return "请输入中文、英文、数字，不支持特殊字符";
  }
}

export function mobile(value) {
  const flag = /^0?1[3|4|5|8][0-9]\d{8}$/.test(value);
  if (!flag) {
    return "请输入正确的手机号码";
  }
}

export function number(value) {
  const flag = /^\d+$/.test(value);
  if (!flag) {
    return "请输入数字";
  }
}

export function tel(value) {
  const flag = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value);
  if (!flag) {
    return "例如：区号-电话号码-分机号(010-1234567-123)";
  }
}

export function eUser(value) {
  const flag = /^[\u0391-\uFFE5\w]+$/.test(value);
  if (!flag) {
    return "名称只允许汉字、英文字母、数字及下划线。";
  }
}

export function safepass(value) {
  const flag = /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/.test(value);
  if (!flag) {
    return "密码由字母和数字组成，至少6位";
  }
}

export function idCard(value) {
  const flag = () => {
    if (value.length == 18 && 18 != value.length) return false;
    var number = value.toLowerCase();
    var d, sum = 0, v = '10x98765432', w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
      a = '11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91';
    var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/);
    if (re == null || a.indexOf(re[1]) < 0) return false;
    if (re[2].length == 9) {
      number = number.substr(0, 6) + '19' + number.substr(6);
      d = ['19' + re[4], re[5], re[6]].join('-');
    } else d = [re[9], re[10], re[11]].join('-');
    if (!isDateTime.call(d, 'yyyy-MM-dd')) return false;
    for (var i = 0; i < 17; i++) sum += number.charAt(i) * w[i];
    return (re[2].length == 9 || number.charAt(17) == v.charAt(sum % 11));
  }
  if (!flag) {
    return "请输入正确的身份证号码";
  }
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}
