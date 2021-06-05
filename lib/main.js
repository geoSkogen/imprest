'use strict'

const dominator = {

  construct_els : function (obj) {
    var elms = {}
    var block = {}
    obj.table.forEach( function (row) {

      var text_node = ''
      elms[row[0]] = document.createElement(row[1])

      if (row[4]) {
        text_node = document.createTextNode(row[4])
        elms[row[0]].appendChild(text_node)
      }

      if (row[1] === 'a') {
        elms[row[0]].href = 'https://' + row[3]
      }
    }) //ends table iteration
    //
    block = this.assoc_el_nest(elms)
    return { title : obj.title, nest : block }
  },

  assoc_el_nest : function (assoc) {
    var parent_key_str = ''
    var top_index = -1
    var nest = {}
    var key_table = {'parents':[],'children':[]}
    var keys = Object.keys(assoc)

    keys.forEach( function (key) {

      var new_row = key.split('_')
      if (new_row.length < 2) {
        new_row.splice(0,0,'')
      }
      key_table['parents'].push(new_row[0])
      key_table['children'].push(new_row[1])
    })

    keys.forEach( function (this_key) {
      var slugs = this_key.split('_')
      var parent_slug = slugs.length > 1 ? slugs[0] : ''
      var this_index = key_table['children'].indexOf(parent_slug)
      
      if (this_index > -1) {

        parent_key_str = key_table['parents'][this_index] ?
          key_table['parents'][this_index] + '_' : ''
        parent_key_str +=  key_table['children'][this_index]

        if (assoc[parent_key_str]) {
          assoc[parent_key_str].appendChild(assoc[this_key])
        } else {
          console.log('parent key not found: ' + parent_key_str)
        }
      } else {
        parent_key_str = ''
      }
    })

    top_index = key_table['parents'].indexOf('')

    if (top_index  > -1) {

      parent_key_str = key_table['children'][top_index]
      nest = assoc[parent_key_str]
    }

    return nest
  }
}
