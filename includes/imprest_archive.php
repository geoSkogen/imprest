<?php

class BOC_Archive {

  public $hex_index;
  public $author;
  public $date_time;
  public $post_type;
  public $addressee;
  public $body;
  public $mvng_lines;
  public static $post_props = [
    'hex_index','author',
    'post_type','addressee','body','mvng_lines'
  ];

  public $client;

    public $hex_index;
    public $author;
    public $post_type;
    public $addressee;
    public $body;
    public $mvng_lines;
    public $date_time;
    private $client;

  public function __construct($db_client) {

    $this->props = [
      'hex_index','author','post_type',
      'addressee','body','mvng_lines'
    ];

    $this->date_time = date("Y-m-d H:i:s");
    $this->client = $db_client;
  }

  public function new($data) {

    //$this->props = $props;
    $result = null;
    $prop_str = implode(',',$this->props);
    $vals_str = '';
    $prop_str .= ',date_time';
    foreach( $this->props as $prop ) {
      $this->{$prop} = !empty($data[$prop]) : $data[$prop] : '';
      $vals_str .= (array_search($prop,$this->props)) ? "," : "";
      $vals_str .= "'" . $this->{$prop} . "'";
    }
    $vals_str.= ",'" . $this->date_time . "'";
    $sql = "INSERT INTO archives ($prop_str) VALUES ($vals_str)";
    $resp = $this->client->query($sql);
    //print_r($sql);
    if ($resp) {
      $result =  $resp;
      //print_r($resp);
    }
    return $result;
  }


  public function parse_query_string($query_str) {
    $query_arr = explode('&',$query_str);
    $keyval_arr = [];
    $query_obj =  new stdClass;
    foreach( $query_arr as $keyval_pair) {
      $keyval_arr = explode('=', $keyval_pair);
      $query_obj->{$keyval_arr[0]} = $keyval_arr[1];
    }
    return $query_obj;
  }
}

?>
