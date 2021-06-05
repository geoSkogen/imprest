<?php

class Imprest_Resp {

  public $controller;
  public $method;
  public $json;
  public $resouce_name;
  public $action_name;
  protected $post_data;
  //
  public function __construct($method,$uri,$query_str,$data) {
    //
    $this->method = $method;
    //
    if ($method==='POST' && $data) {
      $this->post_data = $data;
    }
    $this->json = $this->parse_resource($uri,$query_str);
  }

  protected function parse_resource($uri,$query_str) {

    $json = '{}';
    $uri_arr = explode('/',$uri);
    $resource = ( !empty($uri_arr[count($uri_arr)-1]) ) ?
      $uri_arr[count($uri_arr)-1] : $uri_arr[count($uri_arr)-2];

    $obj_act_arr = explode('-',$resource);

    $this->resource_name = ( !empty($obj_act_arr[1]) ) ? $obj_act_arr[1] : $obj_act_arr[0] ;
    $this->action_name = ( !empty($obj_act_arr[1]) ) ? $obj_act_arr[0] : '';

    switch($this->method) {

      case 'POST' :

        break;
      case 'GET' :

        break;
      default :

    }

    return $json;
  }

  protected function route_controller($obj_name,$act_name) {

    if (!class_exists('Imprest_DB_Conn')) {
      include_once 'imprest_db_conn.php';
    }

    $db_conn = new Imprest_DB_Conn('imprest');

    switch ($obj_name) {

      case 'user' :

        $this->controller = new Imprest_User($db_conn);
        break;
      case 'archive' :
        break;
      default :
    }

  }


}
?>
