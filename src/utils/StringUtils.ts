import md5 from "md5";

export const MD5String = (str = "") => {
  return md5(str);
};
