
<?php
//

config_path();

if (!class_exists('Imprest_DB_Conn')) {
  include_once PATH_BACK . 'includes/imprest_db_conn.php';
}

if (!class_exists('Doc_Util')) {
  include_once PATH_BACK . 'templates/doc_util.php';
}

$db_conn = new Imprest_DB_Conn( DOMAIN );

$doc_util = new Doc_Util( DOMAIN );

$html = $doc_util->assemble_html_doc( THIS_PATH );

print $html;

//

//
function config_path () {
  //
  define( 'DOMAIN' , 'imprest' );

  define( 'DEV_ENV',  (strpos($_SERVER['HTTP_HOST'],'localhost')>-1) ? true : false );

  define( 'DEV_HOST',  (DEV_ENV) ? DOMAIN : '' );

  define( 'THIS_HOST', $_SERVER['HTTP_HOST'] . '/' . DEV_HOST );

  define( 'THIS_PATH', (DEV_ENV) ?
    str_replace( DEV_HOST . '/', '', $_SERVER['REQUEST_URI']) :
    $_SERVER['REQUEST_URI'] );

  $uri_backtrace = '';
  $uri_arr = explode('/',THIS_PATH);

  foreach($uri_arr as $slug) {
    if ($slug) {
      $uri_backtrace .= '../';
    }
  }
  define ('PATH_BACK', $uri_backtrace);
}
//
?>
