import HtmlUtils from "./HtmlUtils";

class SourceData {
  constructor(element) {
    this.tagName = element.tagName.toUpperCase()
    this.url = element.src
    this.source = element.outerHTML
    this.content = element.innerHTML
  }

  canRender() {
    return this.tagName == 'SCRIPT' || this.url.indexOf('www.youtube.com') < 0
  }

  getKnownName() {
    const { url } = this

    if (url.indexOf('gist.github.com')) {
      return 'GIST'
    }
  }

  getTitle() {
    const name = this.getKnownName()
    if (name) {
      return name
    } else {
      return this.tagName
    }
  }

  getContent() {
    if (this.content) {
      return HtmlUtils.stripHtml(this.content)
    } else {
      return this.url
    }
  }

  getSource() {
    return HtmlUtils.urlEncode(this.source)
  }

  getRawSource() {
    return this.source
  }
}

export default SourceData
