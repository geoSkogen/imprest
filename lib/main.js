'use strict'

const dominator = {

  parse_plpml_str: function (str_arg) {

    const text_attributes_obj = {}

    var dom_note = str_arg.slice( 0, str_arg.indexOf('{') )

    const atts_note = str_arg.slice( str_arg.indexOf('{')+1, str_arg.indexOf('}') )
    const atts_arr = atts_note.split(';')

    const data_note = str_arg.slice( str_arg.indexOf('(')+1, str_arg.indexOf(')') )

    text_attributes_obj.innerText = data_note

    if (dom_note.indexOf('.')>0) {
      //
      text_attributes_obj["class"] = dom_note.slice(
         dom_note.indexOf('.')+1,
         dom_note.length
      )
      dom_note = dom_note.slice( 0, dom_note.indexOf('.') )
    }

    if (dom_note.indexOf('#')>0) {
      //
      text_attributes_obj.id = dom_note.slice(
         dom_note.indexOf('#')+1,
         dom_note.length
     )
     dom_note = dom_note.slice( 0, dom_note.indexOf('#') )
    }

    text_attributes_obj.tagName = dom_note

    atts_arr.forEach( (key_val_pair) => {
      //
      let key_val_arr = key_val_pair.split(':')
      text_attributes_obj[ key_val_arr[0] ] = key_val_arr[1]
    })

    return text_attributes_obj
  },

  render_plp_obj: function(attr_arr,data_arr) {
    // the pmpml attribute's value defines the object's scope
    const el = document.createElement(attr_arr.tagName)
    const scope_str = (attr_arr['plpml']) ? attr_arr['plpml'] : null
    //
    let keys_arr = []
    let pos_arr = []
    let data_str = ''
    //
    Object.keys(attr_arr).forEach( (key) => {
      // ensure the json resource contains the plpml scope of the current object
      let text_collection = {}
      let this_scope = (scope_str && data_arr && data_arr[scope_str]) ?
        data_arr[scope_str] : null
      this_scope = (scope_str==='data') ? data_arr : this_scope


      if (key) {
        if (key != 'tagName') {
          // determine if there's a variable in the plpml attribute
          if (this_scope && attr_arr[key].indexOf('@_')>-1)  {

            text_collection = this.dynamic_text_collection(attr_arr[key], this_scope)
            // the variable name and the string indices of its raw value are
            //stored in lista, later joined on CSV and stored in the HTML
            keys_arr.push( text_collection.prop )
            pos_arr.push( text_collection.pos )

            attr_arr[key] = text_collection.new_str
          }

          if (key === 'src' || key === 'href') {
             // urls w/ protocols (https:// = https%3A//) - to reserve the
             // colon as a key-val pair delimiter
             attr_arr[key] = decodeURIComponent( attr_arr[key] )
          }
          //
          if (key != 'innerText')  {
            //
            el.setAttribute(key, attr_arr[key])
          } else {

            el.appendChild( document.createTextNode( attr_arr.innerText ))
          }
        }
      }
    })
    // store original variable names and the character indices of their values
    if (scope_str) {
      //
      if (keys_arr.length) {
        // store them in the rendered HTML
        el.setAttribute('plp-data', keys_arr.join(','))
      }

      if (pos_arr.length) {
        // store them in the rendered HTML
        el.setAttribute('plp-pos', pos_arr.join(','))
      }
    }
    return el
  },


  dynamic_text_collection : function (raw_str,data_scope) {

    const patt = new RegExp(/@_\w+(_\w+)*/)
    const test = raw_str.match(patt)
    let new_str = ''
    let prop = ''
    let pos = ''

    if (test) {
      prop = test[0].replace('@_','')
      pos = raw_str.indexOf(prop)

      if (data_scope[prop]) {
        // create a string containg the dynamic value
        new_str = raw_str.replace( test[0], data_scope[prop] )
        // create a string containing the character position rage of the dynamic value
        pos = pos.toString() + ':' + (pos + data_scope[prop].length).toString()
      } else {
        console.log('your data was not found')
      }
    }
    return { new_str: new_str, prop: prop,  pos: pos }
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

  construct_els: function (plpml,json) {
    // plpml  - template : title element & array of plpml strings - { title: '', nest: [''] }
    // returns the same data sructure with nested HTML elements in the 'nest' property
    const assoc_el_arr = {}
    let nested_els = {}
    let this_title = ''

    plpml.nest.forEach( (data_row) => {
      // translate the string into an associative array of text text_attributes
      let attr_arr = dominator.parse_plpml_str(data_row[1])
      // translate the text attributes into a DOM element
      let next_el = dominator.render_plp_obj(attr_arr,json)
      // associate the DOM elements by their names/nesting-rules
      assoc_el_arr[data_row[0]] = next_el
    })
    // append the elements to one another according to their nesting rules
    nested_els = dominator.nest_assoc_els(assoc_el_arr)
    this_title = json && json.title ?  json.title : ''

    return { nest : nested_els, title: this_title }
  },


  testpattern_template : function () {
    const nested_els = document.createElement('div')
    const this_title = 'Resouce Unavailable'
    const heading = document.createElement('h1')
    const heading_text = document.createTextNode(this_title)

    nested_els.appendChild(heading)

    return { nest : nested_els, title: this_title }
  }

}

// renders the DOM
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
