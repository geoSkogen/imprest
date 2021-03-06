'use strict'

// Test script w/ test data - use to debug plpml string parsing or nesting rules

// simulated markup
const plpml = {
  "title" : "Imprest Test Pattern",
  "nest" : [
["shell","div#og-geo.geo-block-inner{name:ham}()"],
["shell_script","script{plpml:script;type:application/javascript;src:@_imprestive}()"],
["shell_map","div#og-geo-map.geo-block-innermost{}()"],
["shell_cities","div#gb-cities.geo-block-innermost{}()"],
["cities_title","div#gb-title.geo-block-innermost{}()"],
["title_header","h2{plpml:header}(@_title_text)"],
["cities_subheader","p#geo-subhead.geoline{plpml:header}(@_subheader)"],
["cities_geolinetop","h3#gb-cities-top.gb-cities.citiesline{plpml:lines}(@_top_text)"],
["cities_geolinebottom","h3#gb-cities-bottom.gb-cities.citiesline{plpml:lines}(@_bottom_text)"],
["shell_buttons","div#gb-buttons{}()"],
["buttons_linktop","a#linktop.buttonlink{plpml:buttons;href:@_top_href}(@_top_text)"],
["buttons_br","br{}()"],
["buttons_br","br{}()"],
["buttons_linkbottom","a#link-bottom.buttonlink{plpml:buttons;href:@_bottom_href}(@_bottom_text)"]
]
}
// simulated data
const imprest = {
  'header' : {
    'title_text' : 'Imprest Test Pattern',
    'subheader' : 'This page went from pulp to publish',
  },
  'lines' : {
    'top_text' : 'Use minified markup for page templates',
    'bottom_text' : "- or write your own methods for the dominator object to inject dynamic content"
  },
  'buttons' : {
    'top_href' : 'endpoints/imprest/',
    'top_text' : 'see the source markup for this page',
    'bottom_href' : 'endpoints/user/?id=1',
    'bottom_text' : 'example RESTful GET request'
  },
  'script' : {
    'imprestive': '#'
  }
}

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
      text_attributes_obj.className = dom_note.slice(
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
    //
    const scope = (attr_arr['plpml']) ? attr_arr['plpml'] : null
    const el = document.createElement(attr_arr.tagName)
    let keys_arr = []
    let data_str = ''

    Object.keys(attr_arr).forEach( (key) => {

      let this_scope = (scope && data_arr[scope]) ?  data_arr[scope] : null

      if (key) {
        if (key != 'tagName') {
          // push the raw data property keyname to the data array
          if (scope && attr_arr[key].indexOf('@_')>-1)  {

            data_str = attr_arr[key].replace('@_','')
            keys_arr.push( data_str )

            attr_arr[key] = (this_scope && this_scope[data_str]) ?
              this_scope[data_str] : attr_arr[key]
          }

          if (key === 'src' || key === 'href') {
             // urls w/ protocols (https:// = https%3A//) - to reserve the
             // colon as a key-val pair delimiter
             attr_arr[key] = decodeURIComponent( attr_arr[key] )
          }
          //
          if (key != 'innerText')  {

            el.setAttribute(key, attr_arr[key])
          } else {

            el.appendChild( document.createTextNode( attr_arr.innerText ))
          }
        }
      }
    })

    if (scope && keys_arr.length) {
      el.setAttribute('plp-data', keys_arr.join(','))
    }

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

  construct_els: function (plpml,json) {
    // json template : title element, array of plpml strings - { title: '', nest: [''] }
    // returns the same data sructure with nested HTML elements in the 'nest' property
    const assoc_el_arr = {}
    let nested_els = {}

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

    return { nest : nested_els, title: json.title }
  }

}

const nest = dominator.construct_els(plpml,imprest)

document.querySelector('#app').appendChild(nest.nest)
