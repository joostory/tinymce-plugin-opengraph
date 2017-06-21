class App {
  constructor(editor) {
    this.editor = editor
    this.win = null

    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  open() {
    this.win = this.editor.windowManager.open({
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
  }

  close() {
    if (this.win) {
      this.win.close()
      this.win = null
    }
  }

  onSubmit(e) {
    this.close()
  }

  onCancel(e) {
    this.close()
  }
}

export default App
