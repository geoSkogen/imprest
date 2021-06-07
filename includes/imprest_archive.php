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

  public function __construct($db_client) {

    $this->props = [
      'hex_index','author','post_type',
      'addressee','body','mvng_lines'
    ];

    $this->date_time = date("Y-m-d H:i:s");
    $this->client = $db_client;
  }

  public function new($data) {

    $movers = ( is_array($mvrs_arr) ) ? implode(',', $mvrs_arr) : $mvrs_arr;
    $args = [ $id, $usr, $type,$to, $msg, $movers ];
    for ($i = 0; $i < count($args); $i++) {
      $this->{$this->props[$i]} = $args[$i];
    }
    //$this->props = $props;
    $result = null;
    $prop_str = implode(',',$this->props);
    $vals_str = '';
    $prop_str .= ',date_time';
    foreach( $this->props as $prop ) {
      $this->{$prop} = $data[$prop];
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
}

?>
