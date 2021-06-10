'use strict'

const ajax = {

  get : function get(host,uri,custom_template_method) {

    console.log(host)

    console.log(uri)

    var xhttp = new XMLHttpRequest();
    var resp;
    var markup;

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        //
        resp = this.responseText
        //console.log(resp)
        if (JSON.parse(resp)) {

          if (custom_template_method) {
            dom.render(  dominator[custom_template_method]( JSON.parse(resp) ))
          } else {
            dom.render( dominator.construct_els( JSON.parse(resp,markup) ))
          }
        }
      }
    }

    xhttp.open("GET", host + '/endpoints/' + uri + '/', true)
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
