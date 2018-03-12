import SourceData from "./SourceData";

describe('can render', () => {
  test('script can render', () => {
    const target = new SourceData({
      tagName: 'script'
    })
    expect(target.canRender()).toBe(true)
  })
  
  test('iframe can render', () => {
    const target = new SourceData({
      tagName: 'iframe',
      src: 'http://github.com'
    })
    expect(target.canRender()).toBe(true)
  })
  
  test('youtube cannot render', () => {
    const target = new SourceData({
      tagName: 'iframe',
      src: 'https://www.youtube.com/watch/12345'
    })
    expect(target.canRender()).toBe(false)
  })  
})

describe('get title', () => {
  test('unknownname', () => {
    const target = new SourceData({
      tagName: 'script',
      src: 'http://test.com'
    })
    expect(target.getTitle()).not.toBe('SCRIPT')
  })

  test('knownname', () => {
    const target = new SourceData({
      tagName: 'script',
      src: 'https://gist.github.com'
    })
    expect(target.getTitle()).toBe('GIST')
  })
})
