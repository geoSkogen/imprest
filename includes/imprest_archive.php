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

  function __construct($id,$usr,$type,$to,$msg,$mvrs_arr,$db_client) {

    $this->props = [
      'hex_index','author','post_type',
      'addressee','body','mvng_lines'
    ];

    $now = date("Y-m-d H:i:s");
    $movers = ( is_array($mvrs_arr) ) ? implode(',', $mvrs_arr) : $mvrs_arr;
    $args = [ $id, $usr, $type,$to, $msg, $movers ];
    for ($i = 0; $i < count($args); $i++) {
      $this->{$this->props[$i]} = $args[$i];
    }
    //$this->props = $props;
    $this->date_time = $now;;
    $this->client = $db_client;
    $this->new();
  }

  function new() {
    $result = null;
    $prop_str = implode(',',$this->props);
    $vals_str = '';
    $prop_str .= ',date_time';
    foreach( $this->props as $prop ) {
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
