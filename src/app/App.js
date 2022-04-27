import { isURL, validation } from './validate'
import OpengraphRenderer from '../renderer/OpengraphRenderer'
import OpengraphPreviewRenderer from '../renderer/OpengraphPreviewRenderer'
import SourceRenderer from '../renderer/SourceRenderer'

import autobind from 'autobind-decorator'
import { getOption } from './options'

const STATUS_READY = 1
const STATUS_FETCHING = 2
const STATUS_VIEW = 3
const STATUS_FAILED = 4

const MODE_MEDIA = 1
const MODE_SOURCE = 2

class App {
  constructor(editor) {
    this.editor = editor
    this.win = null
    this.opengraph = null
    this.source = ''
    this.status = STATUS_READY
    this.mode = MODE_MEDIA
    this.fetchHandler = getOption(this.editor, 'fetch_handler')
  }

  open() {
    this.win = this.makeWindow()
    this.initView()
    this.attachViewEvent()
    this.updateView()
    this.$input[0].focus()
  }

  makeWindow() {
    return this.editor.windowManager.open({
      title: '미디어 삽입',
      width: 600,
      height: 480,
      body: {
        type: 'panel', 
        items: [
          {
            type: 'htmlpanel',
            name: 'opengraph',
            html: `<div class="mce-opengraph media">
              <div class="mce-opengraph-media">
                <div class="mce-opengraph-header">
                  <form class="opengraph-search-form">
                    <input class="mce-opengraph-input" placeholder="http://url">
                    <button class="mce-opengraph-search" disabled="disabled">확인</button>
                  </form>
                </div>
                <div class="mce-opengraph-body"></div>
              </div>
              <div class="mce-opengraph-source">
                <textarea class="mce-opengraph-textarea" placeholder="<iframe src='media-url' />"></textarea>
              </div>
            </div>`
          }
        ]
      },
      buttons: [
        {
          type: 'custom',
          name: 'toggle-mode',
          text: 'source',
          align: 'start'
        },
        {
          type: 'cancel',
          name: 'cancel',
          align: 'end',
          text: '취소'
        },
        {
          type: 'submit',
          name: 'save',
          align: 'end',
          text: '삽입',
          primary: true
        }
      ],
      onAction: this.handleOnAction,
      onSubmit: this.handleOnSubmit,
      onCancel: this.handleOnCancel,
    })
  }

  initView() {
    const dom = this.editor.dom
    const $area = document.getElementsByClassName('mce-opengraph')[0]
    this.$searchForm = dom.select('.opengraph-search-form', $area)
    this.$input = dom.select('.mce-opengraph-input', $area)
    this.$btnSearch = dom.select('.mce-opengraph-search', $area)
    this.$body = dom.select('.mce-opengraph-body', $area)
    this.$source = dom.select('.mce-opengraph-source .mce-opengraph-textarea', $area)
    this.$area = $area
  }

  @autobind
  handleOnAction(api, data) {
    if (data.name != 'toggle-mode') {
      return
    }

    if (this.mode == MODE_MEDIA) {
      this.handleChangeSourceMode()
    } else {
      this.handleChangeMediaMode()
    }
  }

  @autobind
  handleOnSubmit() {
    const { editor, opengraph, mode, source, win } = this

    let renderer
    if (mode == MODE_MEDIA) {
      renderer = new OpengraphRenderer(opengraph)
    } else if (mode == MODE_SOURCE) {
      renderer = new SourceRenderer(editor.$(source))
    }

    if (renderer) {
      editor.insertContent(renderer.render())
      editor.nodeChanged()
    }
    win.close()
    this.detachViewEvent()
  }

  @autobind
  handleOnCancel() {
    this.detachViewEvent()
  }

  attachViewEvent() {
    this.editor.dom.bind(this.$searchForm, 'submit', e => {
      e.preventDefault()
      this.fetchOpengraph(this.$input[0].value)
    })

    this.editor.dom.bind(this.$input, 'keyup', e => {
      if (isURL(e.target.value, true)) {
        this.editor.dom.setAttrib(this.$btnSearch, 'disabled', null)
      } else {
        this.editor.dom.setAttrib(this.$btnSearch, 'disabled', 'disabled')
      }
    })

    this.editor.dom.bind(this.$source, 'change', e => {
      this.source = e.target.value
    })
  }

  detachViewEvent() {
    if (this.win) {
      this.editor.dom.unbind(this.$searchForm, 'submit')
      this.editor.dom.unbind(this.$input, "keyup")
      
      this.opengraph = null
      this.$searchForm = null
      this.$input = null
      this.$btnSearch = null
      this.$body = null
      this.$source = null
      this.status = STATUS_READY
      this.win = null
    }
  }


  updateView() {
    const { $body, status, mode, editor } = this
    if (mode == MODE_MEDIA) {
      switch (status) {
        case (STATUS_VIEW):
          this.showOpengraph()
          break;
        case (STATUS_FAILED):
          editor.dom.setHTML($body, "미리보기를 불러오지 못했습니다.")
          break;
        case (STATUS_FETCHING):
          editor.dom.setHTML($body, "<span class='ico_blog ico_loading'></span>")
          break;
        default:
          editor.dom.setHTML($body, "이 곳에 미리보기가 표시됩니다.")
      }
    }
    
  }

  fetchOpengraph(value) {
    if (!value || !isURL(value, true)) {
      return
    }

    this.status = STATUS_FETCHING
    this.updateView()

    this.fetchHandler(validation(value), (data) => {
      if (data) {
        this.opengraph = data
        this.status = STATUS_VIEW
      } else {
        this.status = STATUS_FAILED
      }
      this.updateView()
    })
  }

  showOpengraph() {
    const { opengraph, $body, editor } = this
    let renderer = new OpengraphPreviewRenderer(opengraph)
    editor.dom.setHTML($body, renderer.render())
  }

  @autobind
  onSourceChange(e) {
    this.source = this.$source[0].value
  }

  @autobind
  handleChangeSourceMode() {
    this.editor.dom.addClass(this.$area, 'source')
    this.editor.dom.removeClass(this.$area, 'media')
    this.mode = MODE_SOURCE
    this.updateView()
    this.$source[0].focus()
  }

  @autobind
  handleChangeMediaMode() {
    this.editor.dom.addClass(this.$area, 'media')
    this.editor.dom.removeClass(this.$area, 'source')
    this.mode = MODE_MEDIA
    this.updateView()
    this.$input[0].focus()
  }
}

export default App
