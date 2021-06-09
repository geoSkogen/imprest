<?php

class Imprest_User {

  protected $id;
  public $uname;
  public $email;
  private $pword;
  private $client;
  protected $contact_ids;

  public function __construct($db_client) {
    $this->client = $db_client;
  }

  public function new($data) {

    $uname = $data['u_name'];
    $pword = $data['p_word'];
    $email = $data['email'];
    $existing = false;
    $result = array('resp' => null, 'err' => null);
    //
    $existing = $this->select($uname);
    if ($existing) { $result['err'] = 2; }
    //
    $existing = $this->select_by_prop('email',$email);
    if ($existing) { $result['err'] = 1; }
    //
    $sql = "INSERT INTO users (u_name,p_word,email) VALUES ('$uname','$pword','$email')";
    $resp = $this->client->query($sql);
    if ($resp) {
      $this->email = $email;
      $this->uname = $uname;
      //$this->id = $result->id;
      $result['resp'] = $resp;
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

        if ( count(explode(',',$query_obj->range)===2) ) {

          $resp = $this->select_by_range( $range_str );
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
    $id_arr = explode(',',$id_str);
    if (intval($id_arr[0]) && intval($id_arr[1])) {
      $result->top = $id_arr[1]+1;
      $result->bottom = $id_arr[0]-1;
    } else {
      $result = null;
    }
    return $result;
  }

  public function select($uname) {
    $result_arr = [];
    $sql = "SELECT * FROM users WHERE u_name = '{$uname}'";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    return (count($result_arr)) ? $result_arr[0] : null;
  }

  public function select_prop($user,$prop) {
    $result_arr = [];
    $sql = "SELECT {$prop} FROM users WHERE u_name = '{$user}'";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    return (count($result_arr)) ? $result_arr[0][$prop] : null;
  }

  public function select_by_prop($key,$val) {
    $result_arr = [];
    $sql = "SELECT * FROM users WHERE {$key} = '{$val}'";
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
    $range = $this->parse_id_range($range_str);
    $result_arr = [];
    if ($ange) {
      $sql = "SELECT * FROM users WHERE id > $range->bottom AND id < $range->top";
      $resp = $this->client->query($sql);
      //
      while ($row = mysqli_fetch_array($resp)) {
        $result_arr[] = $row;
      }
    }
    return $result_arr;
  }

  public function update($assoc) {
    $sql = "UPDATE users SET ";
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
