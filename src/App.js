import { isURL } from './validate'
import OpengraphRenderer from './OpengraphRenderer'
import OpengraphPreviewRenderer from './OpengraphPreviewRenderer'

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
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onKeydown = this.onKeydown.bind(this)
  }

  open() {
    let win = this.editor.windowManager.open({
      title: '미디어 삽입',
      items: [{
        type: 'container',
        html: '<div class="mce-opengraph" style="width:500px; height:400px"><div class="mce-opengraph-header"><input class="mce-opengraph-input" placeholder="http://url"></div><div class="mce-opengraph-body"></div></div>'
      }],
      buttons: [{
        text: '추가',
        subtype: 'primary',
        onclick: this.onSubmit
      },
      {
        text: '취소',
        onclick: this.onCancel
      }]
    })

    this.$input = win.$('.mce-opengraph-input')
    this.$body = win.$('.mce-opengraph-body')
    this.$input.on("keydown", this.onKeydown)
    this.$input[0].focus()

    this.win = win

    this.showBody()
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

  showBody() {
    const { $body, opengraph, status } = this
    switch (status) {
      case (STATUS_VIEW):
        this.showOpengraph()
        break;
      case (STATUS_FAILED):
        $body.html("<span class='mce-opengraph-error'>정보 가져오기 실패</span>")
        break;
      case (STATUS_FETCHING):
        $body.html("정보 가져오는 중")
        break;
      default:
        $body.html("이 곳에 미리보기가 표시됩니다")
    }
  }

  fetchOpengraph(value) {
    this.status = STATUS_FETCHING
    this.showBody()

    this.fetchHandler(value, (data) => {
      if (data) {
        this.opengraph = data
        this.status = STATUS_VIEW
      } else {
        this.status = STATUS_FAILED
      }
      this.showBody()
    })
  }

  showOpengraph() {
    const { opengraph, $body } = this
    let renderer = new OpengraphPreviewRenderer(opengraph)
    $body.html(renderer.render())
  }

  onKeydown(e) {
    let keyCode = e.keyCode
    let value = this.$input[0].value
    if (keyCode === 13 || keyCode === 9) {
      if (!isURL(value)) {
        this.status = STATUS_FAILED
        this.showBody()
      } else {
        this.fetchOpengraph(value)
      }
    }
  }

  onSubmit(e) {
    const { editor, opengraph } = this

    if (opengraph) {
      let renderer = new OpengraphRenderer(opengraph)
      editor.insertContent(renderer.render())
      editor.nodeChanged()
    }

    this.close()
  }

  onCancel(e) {
    this.close()
  }
}

export default App
