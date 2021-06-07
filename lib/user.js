'use strict'

dominator['user_template'] = function () {

  const test_el = document.createElement('h1')
  test_el.appendChild(document.createTextNode('User JS Test Pattern'))
  
  return { title: 'My China Pig', nest: test_el }
}

ajax.get(THIS_HOST,SLUG,'user_template')
