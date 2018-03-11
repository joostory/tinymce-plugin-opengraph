import HtmlUtils from "./HtmlUtils"

class SourceRenderer {
  constructor($elm) {
    this.$elm = $elm
  }

  render() {
    const { $elm } = this

    const tagName = $elm[0].tagName
    const url = tagName == 'iframe'? $elm.attr('href') : $elm.attr('src')
    const content = tagName != 'iframe' && !url? HtmlUtils.stripHtml($elm.html()) : ''
    const source = HtmlUtils.urlEncode($elm[0].outerHTML)

    return `<div class="mce-opengraph-source" contentEditable="false" data-opengraph-source="${source}">
      <div class="title">${tagName}</div>
      <div class="content">${content? content : url}</div>
    </div>`
  }
}

export default SourceRenderer
