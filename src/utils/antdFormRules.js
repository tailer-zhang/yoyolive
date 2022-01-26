
// 必填
const requireRule = [{
  required: true,
  message: "此项必填",
}];
// 只能输入数字
const NumRule = [
  {
    required: true,
    message: "此项必填",
  },
  {
    pattern: /^[\d.]+$/,
    message: "只能输入数字"
  },
];

// 名称 一般不包含标点符号啥的
const NameRule = [
  {
    required: true,
    message: "此项必填",
  },
  {
    pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
    message: "只能包含文字数字下划线字符!",
  },
];

// 包含所有中文文字和标点符号 逗号、分号句号啥的，外加下划线
const ChineseRule = [
  {
    required: true,
    message: "此项必填",
  },
  {
    pattern: /^[0-9_\s*\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\u4e00-\u9fa5]+$/,
    message: '只能包含文字及中文字符!',
  },
];

export { requireRule, NumRule, NameRule, ChineseRule };
