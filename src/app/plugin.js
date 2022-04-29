import '../style/index.scss'
import App from './App'
import SourceRenderer from '../renderer/SourceRenderer'
import HtmlUtils from '../renderer/HtmlUtils';
import { registerOptions } from './options';

const plugin = (editor, pluginUrl) => {
  registerOptions(editor)

  let app = new App(editor)

  editor.ui.registry.addButton('opengraph', {
    icon: 'embed',
    tooltip: '미디어',
    onAction: () => {
      editor.execCommand('mceOpengraph')
    }
  })

  editor.addCommand('mceOpengraph', () => {
    app.open(editor)
  })

  editor.on("PreProcess", e => {
    const dom = editor.dom
    dom.select('[data-opengraph-url]', e.node).forEach((elm) => {
      dom.setAttrib(elm, "contentEditable", null)
    })
    dom.select('[data-opengraph-source]', e.node).forEach((elm) => {
      elm.outerHTML = HtmlUtils.urlDecode(dom.getAttrib(elm, 'data-opengraph-source'))
    })
  })

  editor.on("SetContent", e => {
    const dom = editor.dom
    dom.select('iframe, script').forEach((elm) => {
      let renderer = new SourceRenderer(elm)
      elm.outerHTML = renderer.render()
    })
    dom.select('[data-opengraph-url]').forEach(elm => {
      elm.contentEditable = false
    })
  })

  editor.shortcuts.add('meta+o', 'Opengraph', 'mceOpengraph')
}

export default plugin;
