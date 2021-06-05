'use strict'


      /*

      basic table schema for text elements
      0 : nesting rules
      1 : element tag
      2 : class
      3 : id
      4 : text content

      */

      /*

      basic table schema for img elements
      0 : nesting rules
      1 : element tag
      2 : class
      3 : id
      4 : src

      */

      /*

      basic table schema for input elements
      0 : nesting rules
      1 : element tag
      2 : type
      3 : id
      4 : name

      */

      /*

      basic table schema for script elements
      0 : nesting rules
      1 : element tag
      2 : type
      3 : src
      4 : text content - javascript code

      */

// assembels an associate array of 'named' html tags
// nesting rules are embedded in the names, from the html metadata JSON table
// returns nested HTML tags
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
// redners the DOM
const dom = {

  app : document.querySelector('#app'),

  render: function (nest) {
    //
    if (nest.title) {

      document.querySelector('title').appendChild(
        document.createTextNode(nest.title)
      )
    }

    if (nest.nest) {
      document.querySelector('#app').appendChild(nest.nest)
    }
  }
}
// hanldes REST
const ajax = {

  get : function get(host,uri,custom_template,custom_method) {
    var xhttp = new XMLHttpRequest();
    var resp;

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        //
        resp = this.responseText
        if (custom_template) {
          dom.render(  dominator[custom_method]( JSON.parse(resp) ))
        } else {
          dom.render( dominator.construct_els( JSON.parse(resp) ))
        }
      }
    }

    xhttp.open("GET", host + "/endpoints/" + uri + '/', true)
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send()
  }
}


const hostname = 'imprest'
const uri_arr = window.location.href.split('/')
// failsafe against requests for the executable document and not the general resource
const slug = (uri_arr[uri_arr.length-1] && uri_arr[uri_arr.length-1]!='index.php') ?
  uri_arr[uri_arr.length-1] : uri_arr[uri_arr.length-2]
// kludge against local dev server environment hostname parsing (i,e,'localhost')
var this_host = window.location.origin.indexOf(hostname) < 0 ?
  window.location.origin + '/' + hostname : window.location.origin
