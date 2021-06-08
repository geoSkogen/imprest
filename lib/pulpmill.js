'use strict'

const json = {
  "title" : "imprest test pattern",
  "nest" : [
["shell","div#og-geo.geo-block-inner{}()"],
["shell_script","script{type:application/javascript;src=benandjerrys.js}()"],
["shell_map","div#og-geo-map.geo-block-innermost{}()"],
["shell_cities","div#gb-cities.geo-block-innermost{}()"],
["cities_title","div#gb-title.geo-block-innermost{}()"],
["title_header","h2{}(California in Vancouver WA)"],
["cities_subheader","p#geo-subhead.geoline{}(The Best Ideal Copy You Can Copy)"],
["cities_geolinetop","h3#gb-cities-top.gb-cities.citiesline{}(Vancouver | Camas | Washougal | Felida | Salmon Creek | Mount Vista | Ridgefield)"],
["cities_geolinebottom","h3#gb-cities-bottom.gb-cities.citiesline{}(Lebiski | Cornfoot)"],
["shell_buttons","div#gb-buttons{}()"],
["buttons_linktop","a#linktop.buttonlink{href:https%3A//goggles.com}(My Spaghetti Sauce)"],
["buttons_linkbottom","a#linkbottom.buttonlink{href:https%3A//sniggles.com}(My Strawberry Sniggles)"]
]
};

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
      let attr_arr = dominator.parse_pulp_str(data_row[1])
      let next_el = dominator.render_pulp_obj(attr_arr)
      assoc_el_arr[data_row[0]] = next_el
    })

    nested_els = dominator.nest_assoc_els(assoc_el_arr)

    return { nest : nested_els, title: json.title }

  }

}

const nest = dominator.construct_els(json)

document.querySelector('#app').appendChild(nest)
