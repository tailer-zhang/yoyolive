// 转换手机号码
function geTel(tel){
  var reg = /^(\d{3})\d{4}(\d{4})$/;
  return tel?.toString()?.replace(reg, "$1****$2");
}

const getElectronModule = (moduleKey) => {
  if (moduleKey in window && typeof window.require === "function") {
    return window.require("electron")[moduleKey];
  } else if (window[moduleKey]) {
    return window[moduleKey];
  }else {
    return null;
  }
};

export {
  geTel,
  getElectronModule
};
