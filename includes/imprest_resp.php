<?php

class Imprest_Resp {

  public $resouce_name;
  public $action_name;
  public $controller;
  public $json;

  public $method;
  public $uri;
  public $query_str;

  protected $post_data;
  //
  public function __construct($method,$uri,$query_str,$data) {
    //
    $this->method = $method;
    $this->uri = $uri;
    $this->query_str = $query_str;
    //
    if ($method==='POST' && $data) {
      $this->post_data = $data;
    }
    $this->json = $this->parse_resource($uri,$query_str);
  }

  protected function parse_resource($uri,$query_str) {

    $json = '{"type":"null"}';
    $uri_arr = explode('/',$uri);
    array_pop($uri_arr);

    $resource = $uri_arr[count($uri_arr)-1];

    $obj_act_arr = explode('-',$resource);

    $this->resource_name = ( !empty($obj_act_arr[1]) ) ? $obj_act_arr[1] : $obj_act_arr[0] ;
    $this->action_name = ( !empty($obj_act_arr[1]) ) ? $obj_act_arr[0] : '';

    switch($this->method) {

      case 'POST' :

        switch($this->action_name) {

          case 'new' :

          case 'update' :

          case 'destroy' :
            if ($this->resource_name) {

              $this->controller = $this->route_resource($this->resource_name);
              // use query string id wih controller select method to populate edit fields as needed
              $resp = $this->controller->{$this->action_name}($this->post_data);

            }
            break;
          default :

        } // end action switch
        // end post case
        break;

      case 'GET' :

        switch($this->action_name) {

          case 'create' :
            break;

          case 'edit' :

          case 'delete' :
            if ($this->resource_name) {
              $this->controller = $this->route_resource($this->resource_name);
              // use query string id wih controller select method to populate edit fields;
            }
            break;
          default :

            if (empty($this->action_name)) {

              if ($this->resource_name) {
                $this->controller = $this->route_resource($this->resource_name);

                $db_query = $this->controller->get($this->query_str);
                $json = ($db_query) ? $db_query : $json;
              }
            } else {
              error_log('GET request to missing resource');
            }
        } // end action switch
        // end get case
        break;
      default :

    }  // end method switch

    return $json;
  }

  protected function route_resource($obj_name) {

    if (!class_exists('Imprest_DB_Conn')) {
      include_once 'imprest_db_conn.php';
    }

    $db_conn = new Imprest_DB_Conn('imprest');

    switch ($obj_name) {

      case 'user' :
        if (!class_exists('Imprest_User')) {
          include_once 'imprest_user.php';
        }
        $controller = new Imprest_User($db_conn);
        break;
      case 'archive' :
        if (!class_exists('Imprest_Archive')) {
          include_once 'imprest_archive.php';
        }
        $controller = new Imprest_Archive($db_conn);
        break;

      default :
        $controller = null;
    }
    return $controller;
  }




}
?>
