const URL_PATTRN = new RegExp(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);

export const isURL = (str) => {
  return str.length < 2083 && URL_PATTRN.test(str);
}
