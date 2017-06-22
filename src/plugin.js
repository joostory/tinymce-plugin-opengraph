import './style/opengraph.css'
import App from './App'

const plugin = (editor) => {
  let app = new App(editor)
  const $ = editor.$

  editor.addButton('opengraph', {
    icon: 'media',
    onclick: e => {
      app.open()
    }
  })

  editor.on("PreProcess", e => {
    $('[data-opengraph-url]', e.node).each((idx, elm) => {
      $(elm).removeAttr("contentEditable")
    })
  })

  editor.on("SetContent", e => {
    $('[data-opengraph-url]').each((idx, elm) => {
      elm.contentEditable = false
    })
  })
}

export default plugin;
