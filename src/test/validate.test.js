import { isURL } from '../validate'

it('validate url', () => {
  expect(isURL('http://www.daum.net')).toBe(true)
  expect(isURL('http://a.com')).toBe(true)
  
})
