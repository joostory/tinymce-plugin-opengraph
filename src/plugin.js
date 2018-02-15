import './style/index.scss'
import App from './App'
import SourceRenderer from './SourceRenderer'

const plugin = (editor) => {
  let app = new App(editor)
  const $ = editor.$

  editor.addButton('opengraph', {
    icon: 'media',
    tooltip: '미디어',
    cmd: 'mceOpengraph'
  })

  editor.addCommand('mceOpengraph', () => {
    app.open()
  })

  editor.on("PreProcess", e => {
    $('[data-opengraph-url]', e.node).each((idx, elm) => {
      $(elm).removeAttr("contentEditable")
    })
    $('[data-opengraph-source]', e.node).each((idx, elm) => {
      $(elm).removeAttr('contentEditable')
      elm.outerHTML = elm.textContent
    })
  })

  editor.on("SetContent", e => {
    $('iframe').each((idx, elm) => {
      let renderer = new SourceRenderer($(elm))
      elm.outerHTML = renderer.render()
    })
    $('script').each((idx, elm) => {
      let renderer = new SourceRenderer($(elm))
      elm.outerHTML = renderer.render()
    })
    $('[data-opengraph-url]').each((idx, elm) => {
      elm.contentEditable = false
    })
  })

  editor.shortcuts.add('meta+o', 'Opengraph', 'mceOpengraph')
}

export default plugin;
