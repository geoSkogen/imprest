'use strict'

const local_data = {
  field_labels : ['user name','email','password','re-enter password'],
  field_names : ['u_name','email','p_word','re_pword']
}


dominator['create_user'] = function (data_obj) {

  const form = document.createElement('div')
  let button = document.createElement('button')

  var field, text, label, input, br

  for (let i = 0; i < local_data.field_names.length; i++) {

    field = local_data.field_names[i]
    text = document.createTextNode( local_data.field_labels[i] )

    label = document.createElement('label')
    input = document.createElement('input')
    br = document.createElement('br')

    form.id = 'create-user-form'
    input.name = field
    input.id = field
    input.className = 'create-user-field'
    //console.log(input.class)
    input.type = 'text'

    label.appendChild(text)
    form.appendChild(label)
    form.appendChild(input)
    form.appendChild(br)
  }

  button.id = 'submit'
  button.innerHTML = 'submit'
  form.appendChild(button)

  dom.submit_form = button
  dom.submit_form.addEventListener('click', function (event) {

    let json = create_user_controller.clean_post_data()

    if (json) {
      console.log(json)
      const resp = ajax.post(THIS_HOST,'user/new-user', json)
      console.log(resp)
    }
  })

  return { title : 'Create User', nest: form }
}


const create_user_controller = {

  clean_post_data : function () {

    var json = {}
    const fields = document.querySelectorAll('.create-user-field')

    fields.forEach( (field) => {

      if (field.value) {
        // !!! error binding--validation here !!!
        json[field.name] = field.value
      }
    })

    return (Object.keys(json).length===fields.length) ?
      JSON.stringify(json) : null
  }
}

ajax.get_component(THIS_HOST,THIS_PATH,'create_user');
