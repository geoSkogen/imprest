'use strict'

const ajax = {

  get_component : function get(host,uri,custom_template_method,query_str) {

    console.log(host)

    console.log(uri)

    var xhttp = new XMLHttpRequest();
    var xhttp1 = new XMLHttpRequest();
    var resp;
    var resp1;
    var path;
    var extension;

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        //
        resp = this.responseText
        //
        if (JSON.parse(resp)) {

          if (custom_template_method) {
            // custom render method
            dom.render(  dominator[custom_template_method]( JSON.parse(resp) ))
          } else {

            xhttp1.onreadystatechange = function() {

              if (this.readyState == 4 && this.status == 200) {

                resp1 = this.responseText

                if (JSON.parse(resp1)) {

                  dom.render( dominator.construct_els( JSON.parse(resp), JSON.parse(resp1) ))
                }
              }
            }
            xhttp1.open("GET", host + '/endpoints/' + uri + '/', true)
            xhttp1.setRequestHeader("Content-Type", "application/json")
            xhttp1.send()
          }
        }
      }
    }
    path = (custom_template_method) ?  '/endpoints/' : '/templates/json/'
    extension = (custom_template_method) ? '' : '.json'

    xhttp.open("GET", host + path + uri + extension, true)
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send()
  },

  post : function get(host,uri,json) {

    console.log(host)

    console.log(uri)

    var xhttp = new XMLHttpRequest();
    var resp;

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        //
        resp = this.responseText
        return resp
      }
    }
    console.log(host + '/endpoints/' + uri + '/')
    xhttp.open("POST", host + '/endpoints/' + uri + '/', true)
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send( json )
  }
}

// kludge against local dev server environment hostname parsing (i,e,'localhost')
const DOMAIN = 'imprest';
const DEV_ENV = (window.location.href.indexOf('localhost')>-1) ? true : false;
const DEV_HOST = (DEV_ENV) ? 'imprest' : ''
const THIS_HOST = window.origin + '/' + DEV_HOST
const THIS_PATH = (DEV_ENV) ?
  window.location.pathname.replace(DEV_HOST + '/','') : window.location.pathname

const URI_ARR = THIS_PATH.split('/');
// failsafe against requests for the executable document and not the general resource
let len = URI_ARR.length
const SLUG = (URI_ARR[len-1] && URI_ARR[len-1]!='index.php') ?
  (URI_ARR[len-1]) : (URI_ARR[len-2]) ? URI_ARR[len-2] : DOMAIN
