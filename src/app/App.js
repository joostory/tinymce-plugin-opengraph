import { isURL } from './validate'
import OpengraphRenderer from '../renderer/OpengraphRenderer'
import OpengraphPreviewRenderer from '../renderer/OpengraphPreviewRenderer'
import SourceRenderer from '../renderer/SourceRenderer'

import autobind from 'autobind-decorator'

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

    this.fetchHandler = this.editor.settings.opengraph && this.editor.settings.opengraph.fetch_handler ? this.editor.settings.opengraph.fetch_handler : () => {}
  }

  open() {
    let win = this.editor.windowManager.open({
      title: '미디어 삽입',
      items: [{
        type: 'container',
        html: '<div class="mce-opengraph media" style="width:600px; height:534px">\
          <div class="mce-opengraph-media">\
            <div class="mce-opengraph-header">\
              <input class="mce-opengraph-input" placeholder="http://url">\
              <button class="mce-opengraph-search"><i class="mce-ico mce-plus">확인</i></button>\
            </div>\
            <div class="mce-opengraph-body"></div>\
          </div>\
          <div class="mce-opengraph-source">\
            <textarea class="mce-opengraph-textarea" placeholder="<iframe src=\'media-url\' />"></textarea>\
          </div>\
          <div class="mce-opengraph-footer">\
            <div class="mce-opengraph-mode">\
              <a class="btn-source-mode">source</a>\
              <a class="btn-media-mode">media</a>\
            </div>\
            <div class="mce-opengraph-btns">\
              <button class="btn-cancel">취소</button>\
              <button class="btn-submit" disabled>삽입</button>\
            </div>\
          </div>\
        </div>'
      }],
      buttons: []
    })
    win.statusbar.remove()

    this.$area = win.$('.mce-opengraph')
    this.$input = win.$('.mce-opengraph-input')
    this.$btnSearch = win.$('.mce-opengraph-search')
    this.$body = win.$('.mce-opengraph-body')
    
    this.$source = win.$('.mce-opengraph-source .mce-opengraph-textarea')

    this.$btnSubmit = win.$('.mce-opengraph-btns .btn-submit')
    this.$btnCancel = win.$('.mce-opengraph-btns .btn-cancel')
    this.$window = win.$(window)
    this.$modalBlock = win.$('#mce-modal-block')
    this.$btnSourceMode = win.$(".btn-source-mode")
    this.$btnMediaMode = win.$(".btn-media-mode")
    
    this.$input.on("keydown", this.onSearchInputKeydown)
    this.$btnSearch.on("click", this.onSearch)
    this.$source.on("keyup", this.onSourceChange)
    this.$btnSubmit.on("click", this.onSubmit)
    this.$btnCancel.on("click", this.onCancel)
    this.$window.on("keydown", this.onWindowKeydown)
    this.$modalBlock.on("click", this.onCancel)
    this.$btnSourceMode.on("click", this.handleChangeSourceMode)
    this.$btnMediaMode.on("click", this.handleChangeMediaMode)
    this.$input[0].focus()

    this.win = win

    this.updateView()
  }

  close() {
    if (this.win) {
      this.$input.off("keydown")
      this.$btnSearch.off("click")
      this.$btnSubmit.off("click")
      this.$btnCancel.off("click")
      this.$window.off("keydown")
      this.$modalBlock.off("click")
      this.$btnSourceMode.off("click")
      this.$btnMediaMode.off("click")
      this.win.close()
      
      this.opengraph = null
      this.$input = null
      this.$body = null
      this.status = STATUS_READY
      this.win = null
    }
  }

  updateView() {
    const { $body, $btnSubmit, opengraph, status, mode, source } = this
    if (mode == MODE_SOURCE) {
      if (source.length > 0) {
        $btnSubmit.removeAttr("disabled")
      } else {
        $btnSubmit.attr("disabled", true)
      }
    } else {
      switch (status) {
        case (STATUS_VIEW):
          this.showOpengraph()
          $btnSubmit.removeAttr("disabled")
          break;
        case (STATUS_FAILED):
          $body.html("미리보기를 불러오지 못했습니다.")
          $btnSubmit.attr("disabled", true)
          break;
        case (STATUS_FETCHING):
          $body.html("<span class='ico_blog ico_loading'></span>")
          $btnSubmit.attr("disabled", true)
          break;
        default:
          $body.html("이 곳에 미리보기가 표시됩니다.")
          $btnSubmit.attr("disabled", true)
      }
    }
    
  }

  fetchOpengraph(value) {
    this.status = STATUS_FETCHING
    this.updateView()

    this.fetchHandler(value, (data) => {
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
    const { opengraph, $body } = this
    let renderer = new OpengraphPreviewRenderer(opengraph)
    $body.html(renderer.render())
  }

  @autobind
  onWindowKeydown(e) {
    let keyCode = e.keyCode
    if (keyCode === 27) {
      this.close()
    }
  }

  @autobind
  onSearchInputKeydown(e) {
    let keyCode = e.keyCode
    if (keyCode === 13 || keyCode === 9) {
      this.onSearch()
    }
  }

  @autobind
  onSearch() {
    let value = this.$input[0].value
    if (!isURL(value)) {
      this.status = STATUS_FAILED
      this.updateView()
    } else {
      this.fetchOpengraph(value)
    }
  }

  @autobind
  onSourceChange(e) {
    this.source = this.$source[0].value
    this.updateView()
  }

  @autobind
  handleChangeSourceMode() {
    this.$area.addClass('source').removeClass('media')
    this.mode = MODE_SOURCE
    this.updateView()
    this.$source[0].focus()
  }

  @autobind
  handleChangeMediaMode() {
    this.$area.addClass('media').removeClass('source')
    this.mode = MODE_MEDIA
    this.updateView()
    this.$input[0].focus()
  }

  @autobind
  onSubmit(e) {
    const { editor, opengraph, mode, source } = this

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

    this.close()
  }

  @autobind
  onCancel(e) {
    this.close()
  }
}

export default App
