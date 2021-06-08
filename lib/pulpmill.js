'use strict'

const json = {
  title : 'Test',
  nest :[
    ["link","a#out.mylinks{href:https%3A//ginko.kom;target:_blank}(click here for the win!)"]
  ] };

function parse_pulp_str(str_arg) {
  //
  const pulp_memos = str_arg.split('(')
  // dom object note - everything except the content string
  const object_note = pulp_memos[0]
  // !! change this to grab the next-to-last character !!!
  const textnode_str = pulp_memos[1].slice(0,pulp_memos[1].length-1)

  const element_notes = object_note.split('{')
  // tagname#id.class string
  const dom_selector_notes = element_notes[0]
  // text attributes translated to JSON by adding the brackets back
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
}

function render_pulp_obj(assoc_arr) {
  //
  const el = document.createElement(assoc_arr.tag_name)
  el.appendChild( document.createTextNode( assoc_arr.inner_text ))

  Object.keys(assoc_arr).forEach( (key) => {

    let str
    if (key != 'tag_name' && key != 'inner_text') {
      //
      if (key === 'src' || key === 'href') {
        //
         assoc_arr[key] = decodeURIComponent( assoc_arr[key] )
      }

      el.setAttribute(key, assoc_arr[key])
    }
  })
  return el
}


json.nest.forEach( (data_row) => {
  let attr_arr = parse_pulp_str(data_row[1])
  let next_el = render_pulp_obj(attr_arr)
  document.body.appendChild(next_el)
})
