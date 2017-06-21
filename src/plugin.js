import './style/opengraph.css'
import App from './App'

const plugin = (editor) => {
  let app = new App(editor)

  editor.addButton('opengraph', {
    icon: 'media',
    onclick: e => {
      app.open()
    }
  })
}

export default plugin;
