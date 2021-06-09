<?php

if (!class_exists('Imprest_Rest')) {
  include_once '../../../includes/imprest_resp.php';
}
//
$data = file_get_contents("php://input") ?
  file_get_contents("php://input") : '';
//
$req = new Imprest_Resp(
  $_SERVER['REQUEST_METHOD'],
  $_SERVER['REQUEST_URI'],
  $_SERVER['QUERY_STRING'],
  json_decode( $data, true )
);
//
print $req->json;

?>
