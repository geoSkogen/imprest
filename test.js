


'use strict'

const markup_table = [
    ["shell","div.flexrow{}()"],
    ["shell_list","ul#user-menu.biglist{}()"],
    ["list_item","li#user.bigitem{plpml:data}( @_u_name )","n","data"]
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

  markup_table.forEach ( (data_row) => {

    if (data_row[2] && ( !isNaN(data_row[2]) || data_row[2]==='n') ) {

      let handle_arr = data_row[0].split('_')

      repeating.rows.push(data_row)
      repeating.parent_bases.push(handle_arr[1])

      repeating.el_handle_reps[handle_arr[1]] = data_row[2]
    } else {

      new_table.push(data_row)
    }
  })

  if (repeating.rows.length) {

    repeating.rows.forEach( (row) => {

      var handle_arr = row[0].split('_')
      var data_err = null

      if ( !isNaN(row[2]) ) {

        these_reps = row[2]

      } else {

        if (!row[3]) {
          console.log('no data argument supplied for markup row--attempting string extraction')
          let scope_slice = ( row[1].indexOf('plpml:') > -1 ) ?
            row[1].slice( row[1].indexOf('plpml') ) : null

          if (scope_slice) {
            //
             this_data_scope =
              (scope_slice.indexOf(';')) ?
              scope_slice(0, scope_slice.indexOf(';')) :
              //
              ( scope_slice.indexOf('}')) ?
              scope_slice(0, scope_slice.indexOf('}')) :
              null

          } else {
            console.log('no valid plpml attribute found')
            these_reps = 0
          }
        } else {
          console.log('using supplied scope for iteration')
          this_data_scope = row[3]
        }
      }

      if (this_data_scope) {

        these_reps = (this_data_scope==='data') ?
        data_table.length : ( data_table[this_data_scope]) ?
        data_table[this_data_scope].length : 0

      } else {
        console.log('scope parse error - try valid terminating character for scope name')
        these_reps = 0
      }

      console.log('row')
      console.log(row)
      if (repeating.parent_bases.indexOf(handle_arr[0])>-1) {

    // if the repeating element's parent is on the list of repeaters . . .
        console.log('parent iterations tally')
        console.log(repeating.el_handle_tally)
        let current_parent_iteration = repeating.el_handle_tally[handle_arr[0]]
        let new_parent_handle = handle_arr[0] + current_parent_iteration.toString()

        repeating.el_handle_tally[handle_arr[0]]++
        handle_arr[0] = new_parent_handle
      } else {
        console.log('no parent iterations')
      }

      for (let i = 0; i < these_reps; i++) {

        let new_child_handle = handle_arr[1] + i.toString()

        handle_arr[1] = new_child_handle

        let new_handle = handle_arr[0] + '_' + handle_arr[1]

        new_table.push( [ new_handle, row[1] ] )
      }
    })
  }
  return new_table
}

const table = parse_table_reiteration(markup_table, data_table)

console.log(table)
