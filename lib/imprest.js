'use strict'

const dom = {

  app : document.querySelector('#app'),

  render: function (data) {
    if (data) {
      Object.keys(data).forEach( (tagname) => {
        let datapoint = data[tagname]
        let node = document.createTextNode(datapoint)
        dom[tagname] = document.createElement(tagname)
        dom[tagname].appendChild(node)
        dom.app.appendChild(dom[tagname])
      })

      dom['h3'].id = 'imprest'

    }
  }
}

const ajax = {

  get : function get(host,uri) {
    var xhttp = new XMLHttpRequest();
    var resp;

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        resp = this.responseText
        dom.render( JSON.parse(resp) )
      }
    }

    xhttp.open("GET", host + "/endpoints/" + uri + '/', true)
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send()
  }
}


const hostname = 'imprest'
const uri_arr = window.location.href.split('/')

const slug = (uri_arr[uri_arr.length-1] && uri_arr[uri_arr.length-1]!='index.php') ?
  uri_arr[uri_arr.length-1] : uri_arr[uri_arr.length-2]

var this_host = window.location.origin.indexOf(hostname) < 0 ?
  window.location.origin + '/' + hostname : window.location.origin

ajax.get(this_host,slug)
