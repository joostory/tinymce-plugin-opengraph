export const isURL = (str) => {
  var urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
  var url = new RegExp(urlRegex);
  return str.length < 2083 && url.test(str);
}
