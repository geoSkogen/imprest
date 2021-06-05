<?php

class Doc_Util {

  protected $icon_url;
  protected $title;
  protected $uri;

  public function __construct($icon_uri,$title) {
    $this->icon_uri = $icon_uri;
    $this->title = $title;
    $this->uri = '';
  }


  protected function head_top($icon_uri,$title) {
    return "<!DOCTYPE html>
    <html lang='en'>
    <head>
    <meta charset='UTF-8' name='viewport' content='width=device-width, initial-scale=1'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'/>
    <title>$title</title>
    <link rel='icon' href=$icon_uri' type='image/x-icon'/ >
    <link rel='stylesheet' href='style/main.css'/>

    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>

    <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.5.0/css/all.css'
      integrity='sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU'
      crossorigin='anonymous'/>";
  }

  protected function head_script($slugs_arr) {
    $tag = '';
    foreach ($slugs_arr as $slug) {
      $tag .= "<script type='application/javascript' src='lib/{$slug}.js' /></script>";
    }
    return $tag;
  }


  protected function head_style ($slugs_arr) {
    $tag = '';
    foreach ($slugs_arr as $slug) {
      $tag .= "<link rel='stylesheet' href='css/$slug.css' />";
    }
    return $tag;
  }


  protected function body_main($before,$after) {
    return "<body>$before<div id='app' ></div>$after</body>";
  }

  protected function body_bottom($tags) {
    $str = '';
    foreach($tags as $tag) {
      $str .= $tag;
    }
    $str .= '</html>';
    return $str;
  }


  public function assemble_html_doc($uri) {
    // retrofit to handle additional args - see below
    $this->uri = $uri;
    //
    $uri_arr = explode('/',$uri);
    $slug = $uri_arr[count($uri_arr)-1] ?
      $uri_arr[count($uri_arr)-1] : $uri_arr[count($uri_arr)-2];
    //
    // replace w/ arguments but leave as fallbacks
    $style_slugs = [$slug];
    $script_slugs = [$slug];
    // factor out into arguments
    $html_before_app = '';
    $html_after_app = '';
    $footer_tags_arr = [];
    //
    $doc_head = $this->head_top( $this->icon_uri, $this->title );
    $doc_body = $this->body_main( $html_before_app, $html_after_app );
    $doc_foot = $this->body_bottom ( $footer_tags_arr );

    $style_tags = $this->head_style( $style_slugs );
    $script_tags = $this->head_script( $script_slugs );

    $html_head = $doc_head . $style_tags . $script_tags . '</head>';

    $html = $html_head . $doc_body .$doc_foot;

    return $html;
  }
}

?>
