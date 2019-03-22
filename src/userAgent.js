const ua = window.navigator.userAgent.toLowerCase();
const pf = window.navigator.platform.toLowerCase();

export const isWindows = () => pf.includes("win");

export const getBrowser = () => {
  if (ua.includes("msie") || ua.includes("trident")) {
    return "ie";
  } else if (ua.includes("edge")) {
    return "edge";
  } else if (ua.includes("chrome")) {
    return "chrome";
  } else if (ua.includes("safari")) {
    return "safari";
  } else if (ua.includes("firefox")) {
    return "firefox";
  } else if (ua.includes("opera")) {
    return "opera";
  } else {
    return "";
  }
};

export const isIE = () => getBrowser() === "ie";
export const isEdge = () => getBrowser() === "edge";
export const isFirefox = () => getBrowser() === "firefox";
