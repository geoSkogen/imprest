'use strict'


// assembels an associate array of 'named' html tags
// nesting rules are embedded in the names, from the html metadata JSON table
// returns nested HTML tags
/*
const dominator = {

  data_store : {},

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

      if (row[1] === 'script') {
        elms[row[0]].type = row[2]
        elms[row[0]].src = row[3]
        elms[row[0]].innerHTML = row[4]
      }

      if (row[10==='img']) {
        elms[row[0]].src = row[4]
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
*/
const dominator = {

  parse_pulp_str: function (str_arg) {
    //
    const pulp_memos = str_arg.split('(')
    // dom object note - everything except the content string
    const object_note = pulp_memos[0]
    // !! change this to grab the next-to-last character !!!
    const textnode_str = pulp_memos[1].slice(0,pulp_memos[1].length-1)

    const element_notes = object_note.split('{')
    // tagname#id.class string
    const dom_selector_notes = element_notes[0]
    //
    const text_attribute_note =  element_notes[1].split('}')[0]

    const text_attribute_props = text_attribute_note.split(';')

    const text_attributes_obj = {}

    let stage_arr = [];
    let element_str = dom_selector_notes

    if (element_str.indexOf('.')) {
      stage_arr =  dom_selector_notes.split('.')
      text_attributes_obj['className'] = stage_arr[1]
      element_str = stage_arr[0]
    }

    if (element_str.indexOf('#')) {
      stage_arr = element_str.split('#')
      text_attributes_obj['id'] = stage_arr[1]
      element_str = stage_arr[0]
    }

    text_attributes_obj['tag_name'] = element_str
    text_attributes_obj['inner_text'] = textnode_str

    text_attribute_props.forEach( (prop) => {
      let key_val_pair = prop.split(':')
      text_attributes_obj[key_val_pair[0]] = key_val_pair[1]
    })

    return text_attributes_obj
  },

  render_pulp_obj: function(assoc_arr) {
    //
    const el = document.createElement(assoc_arr.tag_name)

    if (assoc_arr.inner_text) {
      el.appendChild( document.createTextNode( assoc_arr.inner_text ))
    }

    Object.keys(assoc_arr).forEach( (key) => {


      if (key && key != 'tag_name' && key != 'inner_text') {
        //
        if (key === 'src' || key === 'href') {
          //
           assoc_arr[key] = decodeURIComponent( assoc_arr[key] )
        }

        el.setAttribute(key, assoc_arr[key])
      }
    })
    return el
  },

  nest_assoc_els : function (assoc) {

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
  },

  construct_els: function (json) {
    //
    const assoc_el_arr = {}
    let nested_els = {}
    //
    json.nest.forEach( (data_row) => {
      //
      let attr_arr = dominator.parse_pulp_str(data_row[1])
      //
      let next_el = dominator.render_pulp_obj(attr_arr)
      //
      assoc_el_arr[data_row[0]] = next_el
    })

    nested_els = dominator.nest_assoc_els(assoc_el_arr)

    return { nest : nested_els, title: json.title }

  }

}
// redners the DOM
const dom = {

  app : document.querySelector('#app'),

  render: function (obj) {
    //
    if (obj.title) {

      document.querySelector('title').appendChild(
        document.createTextNode(obj.title)
      )
    }

    if (obj.nest) {
      document.querySelector('#app').appendChild(obj.nest)
    }
  }
}
