<?php

class Imprest_DB_Conn {

  public $connection;
  public $has_tables;
  public $columns;

  function __construct($domain) {
    $results = [];
    $table_cols = [];
    $this->config($domain);
    $this->db_conn();
    $this->columns['users'] = "CREATE TABLE users (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        u_name text NOT NULL,
        p_word varchar(24) NOT NULL,
        email varchar(64) NOT NULL,
        contact_ids varchar(128) NOT NULL,
        PRIMARY KEY(id)
      )";
    $this->columns['archives'] = "CREATE TABLE archives (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        hex_index mediumint(9) NOT NULL,
        mvng_lines text NOT NULL,
        date_time varchar(64) NOT NULL,
        post_type text NOT NULL,
        author text NOT NULL,
        body text NOT NULL,
        addressee text NOT NULL,
        PRIMARY KEY(id)
      )";

    foreach(['users','archives'] as $table_name) {
      $test_query = "SHOW TABLES LIKE '%{$table_name}'";
      if ($this->query($test_query)->num_rows>0) {

        $results['found']=$table_name;
      } else {

        $results[] = $this->query($this->columns[$table_name]);
      }
    }
    //print_r($results);
    $this->has_tables = $results;
  }

  public function config($domain) {
    $db_conn = array(
      'DB_USER'=>'root',
      'DB_PASSWORD'=>'',
      'DB_HOST'=>'localhost',
      'DB_NAME'=>$domain,
    );
    foreach($db_conn as $key => $val) {
      if ( !defined($key) ) {
        DEFINE ($key, $val);
      }
    }
  }

  public function db_conn() {
    $this->connection = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
    if ($this->connection->connect_errno) {
      //print('db error');
      die("db connect error: " . $this->connection->connect_errno . '<br/>');
    }

    if ($this->connection) {
    }
  }

  public function escape_string($string) {
    $escaped_str = $this->connection->real_escape_string($string);
    return $escaped_str;
  }

  public function query($sql) {
    $clean_str = $this->escape_string($sql);
    $result = $this->connection->query($sql);
    if (!$result) {

    }
    return $result;
  }

}
?>
