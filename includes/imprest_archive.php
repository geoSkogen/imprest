<?php

class Imprest_Archive {

    public $hex_index;
    public $author;
    public $post_type;
    public $addressee;
    public $body;
    public $mvng_lines;
    public $date_time;
    private $client;
    protected $props;

  public function __construct($db_client) {

    $this->props = [
      'hex_index','author','post_type',
      'addressee','body','mvng_lines'
    ];

    $this->date_time = date("Y-m-d H:i:s");
    $this->client = $db_client;
  }

  public function new($data) {
    //
    $result = null;
    $vals_str = '';
    $prop_str = implode(',',$this->props);
    $prop_str .= ',date_time';

    foreach( $this->props as $prop ) {
      // build the CSV string of keys and values
      $this->{$prop} = !empty($data[$prop]) ? $data[$prop] : '';
      $vals_str .= (array_search($prop,$this->props)) ? "," : "";
      $vals_str .= "'" . $this->{$prop} . "'";
    }
    // append the timespamp
    $vals_str.= ",'" . $this->date_time . "'";
    $sql = "INSERT INTO archives ($prop_str) VALUES ($vals_str)";
    $resp = $this->client->query($sql);
    //
    if ($resp) {
      $result =  $resp;
    }
    return $result;
  }

  public function get($query_str) {

    $resp = [];

    $query_obj = $this->parse_query_string($query_str);

    if ( !empty($query_obj->contacts) && !empty($query_obj->id) ) {

      if ($query_obj->contacts) {
        $resp = $this->select_by_assoc( $id,'contacts' );
      }
    }
    if ( empty($query_obj->contacts) ) {

      if ( !empty($query_obj->id) ) {

        $resp = $this->select_by_prop('id',$query_obj->id);

      } else if ( !empty($query_obj->range) ){

        if ( count(explode(':',$query_obj->range))===2) {

          $resp = $this->select_by_range( $query_obj->range );
        }
      }
    }

    return ($resp) ? json_encode($resp) : null;
  }

  public function parse_query_string($query_str) {
    //
    $query_arr = explode('&',$query_str);
    $keyval_arr = [];
    $query_obj =  new stdClass;
    //
    foreach( $query_arr as $keyval_pair) {
      //
      $keyval_arr = explode('=', $keyval_pair);
      //
      if ( !empty($keyval_arr[1]) ) {
        $query_obj->{$keyval_arr[0]} = $keyval_arr[1];
      }
    }
    return $query_obj;
  }

  public function parse_id_range($id_str) {
    $result = new stdClass;
    $id_arr = explode(':',$id_str);
    //
    if (!empty($id_arr[0]) && !empty($id_arr[1])
        && intval($id_arr[0]) && intval($id_arr[1])) {
      //
      $result->top = intval($id_arr[1]+1);
      $result->bottom = intval($id_arr[0]-1);
      //
    } else if (intval($id_arr[0]) && empty($id_arr[1])) {
      //
      $result->top = 0;
      $result->bottom = intval($id_arr[0])-1;
      //
    } else {
      $result = null;
    }
    return $result;
  }

  public function select($id) {
    $result_arr = [];
    $sql = "SELECT * FROM archives WHERE id = '{$id}'";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    return (count($result_arr)) ? $result_arr[0] : null;
  }

  public function select_by_prop($key,$val) {
    $result_arr = [];
    $sql = "SELECT * FROM archives WHERE {$key} = '{$val}'";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    return (count($result_arr)) ? $result_arr[0] : null;
  }

  public function select_by_assoc($id) {
    $rows = [];
    $ids_arr = [];
    $one = $this->select_by_prop('id',$id);
    if ($one) {
      if (!empty($one->contact_ids)) {
        $ids_arr = explode(',',$one->contact_ids);
        foreach( $ids_arr as $next_id) {
          $n = $this->select_by_prop('id',$next_id);
          if ($n) {
            $rows[] = $n;
          }
        }
      }
    }
    return $rows;
  }

  public function select_by_range($range_str) {
    //
    $result_arr = [];
    $range = $this->parse_id_range($range_str);
    //
    if ($range) {
      $sql = "SELECT * FROM archives WHERE id > $range->bottom";
      $sql .= ($range->top!=0) ?  " AND id < $range->top" : '';
      $resp = $this->client->query($sql);
      //
      while ($row = mysqli_fetch_array($resp)) {
        $result_arr[] = $row;
      }
    }
    return $result_arr;
  }

  public function update($assoc) {
    $sql = "UPDATE archives SET ";
    $index = 0;
    foreach ($assoc as $key => $val) {
       $sql .= ($index) ? "," : "";
       $sql .= $key . "= '{$val}'";
       $index++;
    }
    $sql .= " WHERE id = {$this->id}";
    $resp = $this->client->query($sql);
    return $resp;
  }

  public function destroy($uname) {

  }
}

?>
