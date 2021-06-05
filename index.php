<?php

if (!class_exists('Imprest_DB_Conn')) {
  include_once 'includes/imprest_db_conn.php';
}
// head, body, html_doc
include 'templates/doc_util.php';

$db_conn = new Imprest_DB_Conn('imprest');

$doc_util = new Doc_Util('#','Imprest Test Page');

$html = $doc_util->assemble_html_doc( $_SERVER['REQUEST_URI'] );

print $html;















?>
