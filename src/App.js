import { isURL } from './validate'
import OpengraphRenderer from './OpengraphRenderer'
import OpengraphPreviewRenderer from './OpengraphPreviewRenderer'

import autobind from 'autobind-decorator'

const STATUS_READY = 1
const STATUS_FETCHING = 2
const STATUS_VIEW = 3
const STATUS_FAILED = 4


class App {
  constructor(editor) {
    this.editor = editor
    this.win = null
    this.opengraph = null
    this.status = STATUS_READY

    this.fetchHandler = this.editor.settings.opengraph && this.editor.settings.opengraph.fetch_handler ? this.editor.settings.opengraph.fetch_handler : () => {}
  }

  open() {
    let win = this.editor.windowManager.open({
      title: '미디어 삽입',
      items: [{
        type: 'container',
        html: '<div class="mce-opengraph" style="width:600px; height:534px">\
          <div class="mce-opengraph-header">\
            <input class="mce-opengraph-input" placeholder="http://url">\
            <button class="mce-opengraph-search"><i class="mce-ico mce-plus">확인</i></button>\
          </div>\
          <div class="mce-opengraph-body"></div>\
          <div class="mce-opengraph-footer">\
            <button class="mce-opengraph-cancel">취소</button>\
            <button class="mce-opengraph-submit" disabled>삽입</button>\
          </div>\
        </div>'
      }],
      buttons: []
    })
    win.statusbar.remove()

    this.$input = win.$('.mce-opengraph-input')
    this.$btnSearch = win.$('.mce-opengraph-search')
    this.$body = win.$('.mce-opengraph-body')
    this.$btnSubmit = win.$('.mce-opengraph-submit')
    this.$btnCancel = win.$('.mce-opengraph-cancel')
    
    this.$input.on("keydown", this.onKeydown)
    this.$btnSearch.on("click", this.onSearch)
    this.$btnSubmit.on("click", this.onSubmit)
    this.$btnCancel.on("click", this.onCancel)
    this.$input[0].focus()

    this.win = win

    this.updateView()
  }

  close() {
    if (this.win) {
      this.win.close()
      this.opengraph = null
      this.$input.off("keydown")
      this.$input = null
      this.$body = null
      this.status = STATUS_READY
      this.win = null
    }
  }

  updateView() {
    const { $body, $btnSubmit, opengraph, status } = this
    switch (status) {
      case (STATUS_VIEW):
        this.showOpengraph()
        $btnSubmit.removeAttr("disabled")
        break;
      case (STATUS_FAILED):
        $body.html("미리보기를 불러오지 못했습니다.")
        $btnSubmit.attr("disabled")
        break;
      case (STATUS_FETCHING):
        $body.html("<span class='ico_blog ico_loading'></span>")
        $btnSubmit.attr("disabled")
        break;
      default:
        $body.html("이 곳에 미리보기가 표시됩니다.")
        $btnSubmit.attr("disabled")
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
  onKeydown(e) {
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
  onSubmit(e) {
    const { editor, opengraph } = this

    if (opengraph) {
      let renderer = new OpengraphRenderer(opengraph)
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
