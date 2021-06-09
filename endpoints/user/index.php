<?php

if (!class_exists('Imprest_Rest')) {
  include_once '../../includes/imprest_resp.php';
}
//
$data = file_get_contents("php://input") ?
  file_get_contents("php://input") : '';

if ( !empty($_POST) && count(array_keys($_POST)) ) {
  // for backward compatibility with old school server-side $_POST array
  $data = $_POST;

} else if  ( is_string($data) && strlen($data) ) {
  // local AJAX or remote API client post
  $data = json_decode($data, true);

} else {
  error_log('empty post object');
}
//
$req = new Imprest_Resp(
  $_SERVER['REQUEST_METHOD'],
  $_SERVER['REQUEST_URI'],
  $_SERVER['QUERY_STRING'],
  $data
);
//
print $req->json;

?>
