'use strict'

const markup_table = [
    ["shell","div.flexrow{}()"],
    ["shell_list","ul#user-menu.biglist{}()"],
    ["list_item","li.bigitem{}( )","n","data"],
    ["item[n]_span","span.datum{plpml:[n]}( @_u_name )","1"]
]

const data_table = [
  {"0":"1","1":"time","2":"password","3":"time@creation.io","4":"2,3,4,5,6","id":"1","u_name":"time","p_word":"password","email":"time@creation.io","contact_ids":"2,3,4,5,6"},
  {"0":"2","1":"space","2":"password","3":"space@creation.io","4":"1,3,4,5,6","id":"2","u_name":"space","p_word":"password","email":"space@creation.io","contact_ids":"1,3,4,5,6"},
  {"0":"9","1":"dog","2":"dog","3":"dog@dog.dog","4":"","id":"9","u_name":"dog","p_word":"dog","email":"dog@dog.dog","contact_ids":""}
]

function parse_table_reiteration(markup_table, data_table) {

  const repeating = {
    el_handle_reps : {},
    el_handle_tally : {},
    parent_bases :  [],
    rows : []
  }

  const new_table = []
  var these_reps
  var this_data_scope
  var parent_iteration
  var parent_iteration_index
  // first iteration racks up info on any reiteratin element 'rows'
  markup_table.forEach ( (data_row) => {

    if (data_row[2] && ( !isNaN(data_row[2]) || data_row[2]==='n') ) {

      let handle_arr = data_row[0].split('_')

      repeating.rows.push(data_row)
      // leave a trace of the plain element handle - to be looked up by any child elements
      repeating.parent_bases.push(handle_arr[1])

    } else {

      new_table.push(data_row)
    }
  })

  if (repeating.rows.length) {

    repeating.rows.forEach( (row) => {

      var handle_arr = row[0].split('_')
      var data_err = null

      if ( !isNaN(row[2]) ) {
        // literal iteration
        these_reps = row[2]

      } else {
        // literation by data object size
        if (!row[3]) {
          console.log('no data argument supplied for markup row--defaulting to principal object')
          this_data_scope = 'data'
        } else {
          console.log('using supplied scope for iteration')
          this_data_scope = row[3]
        }

        if (this_data_scope) {

          these_reps = (this_data_scope==='data') ?

            data_table.length :
            ( data_table[this_data_scope] ) ?
            data_table[this_data_scope].length : 0

        } else {
          console.log('scope parse error - try valid terminating character for scope name')
          these_reps = 0
        }

      }
      // leace a trace of how far to increment parent handle index numbers
      repeating.el_handle_reps[handle_arr[1]] = these_reps
      // add a tally property based on the element's name prior to
      // iterations & appendage of the element's index# to its handle
      repeating.el_handle_tally[handle_arr[1]] = undefined

      console.log('row')
      console.log(row)

      parent_iteration = (
        repeating.parent_bases.indexOf( handle_arr[0].replace( '[n]','') )>-1
      ) ? true : false;

      parent_iteration_index = parent_iteration ?
        repeating.el_handle_reps[handle_arr[0].replace('[n]','')] : 1

      for (var n = 0; n < parent_iteration_index; n++) {

        for (var i = 0; i < these_reps; i++) {

          let new_child_handle = handle_arr[1] + i.toString()

          let new_parent_index = (parent_iteration) ? n.toString() : ''

          let new_parent_handle = ( handle_arr[0].indexOf('[n]')>-1 ) ?
            handle_arr[0].replace( '[n]', new_parent_index ) :
            (parent_iteration) ?
            handle_arr[0] + new_parent_index : handle_arr[0]

          let new_handle = new_parent_handle + '_' + new_child_handle

          var plpml_str = (row[1].indexOf('[n]') > -1) ?
              row[1].replace( '[n]', i.toString() ) : row[1]

          repeating.parent_bases.push(new_child_handle)
          //
          new_table.push( [ new_handle, plpml_str ] )
        }

      }

    })
  }
  return new_table
}

const table = parse_table_reiteration(markup_table, data_table)

console.log(table)
