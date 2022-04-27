const DEFAULT_OPTIONS = {
  fetch_handler: () => {}
}

let options = null

export function registerOptions(editor) {
  const register = editor.options.register
  register('opengraph', {
    processor: 'object',
    default: DEFAULT_OPTIONS
  })
}

export function getOption(editor, key) {
  if (!options) {
    options = editor.options.get('opengraph')
  }
  return options[key] || DEFAULT_OPTIONS[key]
}
