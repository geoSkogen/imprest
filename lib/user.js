'use strict'

dominator['user_template'] = function (data_obj) {
  //console.log(data_obj)
  const list_el = document.createElement('ul')
  data_obj.forEach( (row) => {
    let li_el = document.createElement('li')
    li_el.innerHTML = JSON.stringify(row)
    list_el.appendChild(li_el)
  })

  return { title: 'My China Pig', nest: list_el  }
}

ajax.get_component(THIS_HOST,SLUG,'user_template','range=1:')
