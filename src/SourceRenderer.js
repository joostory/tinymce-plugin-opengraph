class SourceRenderer {
  constructor($elm) {
    this.$elm = $elm
  }

  getStripHtml(source) {
    return source.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  getEncoded(source) {
    return encodeURIComponent(source)
  }

  render() {
    const { $elm } = this

    let url = $elm.attr("data-opengraph-url")
    let image = $elm.attr("data-opengraph-image")
    let title = decodeURIComponent($elm.attr("data-opengraph-title"))
    const source = $elm[0].outerHTML

    if (image) {
      return `<div class="mce-opengraph-source" contentEditable="false" data-opengraph-source="${this.getEncoded(source)}"><img src="${image}"><span>${this.getStripHtml(title)}</span><span>${url}</span></div>`
    } else {
      return `<div class="mce-opengraph-source" contentEditable="false" data-opengraph-source="${this.getEncoded(source)}">${this.getStripHtml(source)}</div>`
    }

    
  }
}

export default SourceRenderer
