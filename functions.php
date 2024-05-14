<?php
/* CLIENT SIDE */
// add_action('wp_enqueue_scripts', function(){

// });

/* ADMIN SIDE */
add_action('admin_menu', 'register_webarch_wpcf7', 1000);

function register_webarch_wpcf7(){
    global $menu;
    $webArchThemeIsActive = false;
    foreach($menu as $item){
        if($item[0] == "WebArchitect"){
            $webArchThemeIsActive = true;
            break;
        }
    }
    if($webArchThemeIsActive)
	    add_submenu_page('wa-settings.php', 'WebArch расширение для плагина ContactFrom7', 'ContactForm7', 'edit_others_posts', 'wacf7_admin_menu.php', 'wacf7_admin_menu_page', 21);
    else
        add_menu_page('WebArch расширение для плагина ContactFrom7', 'WA CF7', 'edit_others_posts', 'wacf7_admin_menu.php', 'wacf7_admin_menu_page', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4NCjxnPg0KCTxwYXRoIGZpbGw9IiNhN2FhYWQiIGQ9Ik0yLjQ5LDQuMDljLTAuNjEsMS4xOS0xLjIsMi4zNi0xLjgsMy41NEMwLjYzLDcuNTEsMC41OSw3LjQxLDAuNTQsNy4zQzAuMzgsNi45NiwwLjIyLDYuNjEsMC4wNiw2LjI3DQoJCUMwLjA0LDYuMjIsMC4wMyw2LjE0LDAuMDYsNi4wOWMxLTEuOTgsMi0zLjk1LDMuMDEtNS45MkMzLjA3LDAuMTYsMy4wOCwwLjE1LDMuMSwwLjEzQzMuMTIsMC4xNywzLjE0LDAuMiwzLjE2LDAuMjQNCgkJYzEuMzQsMi42NSwyLjY3LDUuMyw0LjAxLDcuOTVjMC4zMSwwLjYxLDAuNjIsMS4yMywwLjkyLDEuODRjMC4wMiwwLjA0LDAuMDIsMC4xMi0wLjAxLDAuMTdjLTEuMTMsMS44My0yLjI3LDMuNjUtMy40MSw1LjQ4DQoJCWMtMC4wMSwwLjAxLTAuMDIsMC4wMi0wLjA0LDAuMDVjLTAuMDgtMC4yMS0wLjE2LTAuNDEtMC4yNC0wLjYxYy0wLjIzLTAuNTgtMC40Ni0xLjE3LTAuNy0xLjc1Yy0wLjA0LTAuMS0wLjA0LTAuMTgsMC4wMi0wLjI3DQoJCWMwLjU5LTAuOTQsMS4xOC0xLjg5LDEuNzgtMi44NGMwLjA0LTAuMDcsMC4wNS0wLjEyLDAuMDEtMC4yQzQuNTIsOC4xLDMuNTQsNi4xNSwyLjU1LDQuMkMyLjU0LDQuMTcsMi41Miw0LjE1LDIuNDksNC4wOXoiLz4NCgk8cGF0aCBmaWxsPSIjYTdhYWFkIiBkPSJNMTYuODMsNy45MUMxNi4xMSw2LjgsMTUuNCw1LjcsMTQuNjgsNC41OGMwLjMyLDAuMDMsMC42MiwwLjA2LDAuOTIsMC4wOWMwLjEzLDAuMDEsMC4yNywwLjA0LDAuNCwwLjA0DQoJCWMwLjIxLTAuMDEsMC4zMywwLjA5LDAuNDQsMC4yNmMxLjE0LDEuNzgsMi4yOSwzLjU2LDMuNDQsNS4zM2MwLjAyLDAuMDQsMC4wNSwwLjA4LDAuMDgsMC4xM2MtMC4wOSwwLTAuMTcsMC0wLjI1LDANCgkJYy0xLjU5LTAuMS0zLjE5LTAuMTktNC43OC0wLjI5Yy0yLTAuMTItNC4wMS0wLjI0LTYuMDEtMC4zNkM4LjgzLDkuNzcsOC43OCw5Ljc0LDguNzMsOS42NkM3Ljc0LDcuNzgsNi43NSw1Ljg5LDUuNzUsNC4wMQ0KCQljLTAuMDEtMC4wMi0wLjAyLTAuMDUtMC4wNS0wLjFjMC4xNywwLjAyLDAuMzEsMC4wNCwwLjQ2LDAuMDdjMC42OSwwLjExLDEuMzgsMC4yMSwyLjA4LDAuMzFjMC4xLDAuMDEsMC4xNSwwLjA1LDAuMTksMC4xNA0KCQljMC41MSwwLjk4LDEuMDMsMS45NSwxLjU0LDIuOTNjMC4wNiwwLjExLDAuMTIsMC4xNiwwLjI0LDAuMTZjMS4wOCwwLjA2LDIuMTcsMC4xMywzLjI1LDAuMTljMS4wNiwwLjA2LDIuMTIsMC4xMywzLjE4LDAuMTkNCgkJQzE2LjcsNy45MSwxNi43Niw3LjkxLDE2LjgzLDcuOTF6Ii8+DQoJPHBhdGggZmlsbD0iI2E3YWFhZCIgZD0iTTE1LjQsMTAuNzdjLTAuNDYsMC41OC0wLjkxLDEuMTQtMS4zNSwxLjdjLTAuMDYsMC4wNy0wLjEyLDAuMTMtMC4xNywwLjIxYy0wLjEsMC4xNy0wLjI0LDAuMi0wLjQzLDAuMg0KCQljLTEuMDctMC4wNS0yLjEzLTAuMDktMy4yLTAuMTNjLTAuMTEsMC0wLjE3LDAuMDItMC4yMywwLjEyYy0xLjE2LDEuNzYtMi4zMiwzLjUyLTMuNDgsNS4yN2MtMC4wNSwwLjA4LTAuMTEsMC4xNy0wLjE4LDAuMjcNCgkJYzEuMzMtMC4wNywyLjYzLTAuMTMsMy45Ni0wLjJjLTAuMDIsMC4wNC0wLjA0LDAuMDctMC4wNiwwLjFjLTAuMjYsMC4zNy0wLjUzLDAuNzMtMC43OSwxLjExYy0wLjA1LDAuMDgtMC4xMSwwLjExLTAuMjEsMC4xMg0KCQljLTEuMTYsMC4wNi0yLjMyLDAuMTItMy40OCwwLjE3Yy0xLjAxLDAuMDUtMi4wMSwwLjEtMy4wMiwwLjE1Yy0wLjA0LDAtMC4wOSwwLTAuMTUsMGMwLjE3LTAuMjUsMC4zMi0wLjQ5LDAuNDgtMC43Mg0KCQljMS44OC0yLjg0LDMuNzUtNS42OCw1LjYzLTguNTJjMC4wNC0wLjA3LDAuMDktMC4xLDAuMTctMC4wOWMyLjE0LDAuMDgsNC4yOCwwLjE2LDYuNDMsMC4yNEMxNS4zNCwxMC43NiwxNS4zNiwxMC43NywxNS40LDEwLjc3eiINCgkJLz4NCjwvZz4NCjwvc3ZnPg==', 100);
}

function wacf7_admin_menu_page(){
    ?>
    <div id="wacf7-container"></div>
    <?php
}

add_action('admin_enqueue_scripts', function($hook){
    if (strpos($hook, 'wacf7_admin_menu') === false)
        return;
    wp_enqueue_style('wacf7-plugin', WACF7_BUILD_URI."index.css");
    wp_enqueue_script('wacf7-plugin', 
                      WACF7_BUILD_URI."index.js", 
                      (require(WACF7_BUILD_DIR."index.asset.php"))["dependencies"], 
                      false,
                      ["in_footer" => true]);
    $config = get_option("wacf7-config");
    wp_add_inline_script('wacf7-plugin', 
        'wacf7PluginUri = "'.WACF7_PLUGIN_URI.'";
        wacf7Config = '.($config ? '`'.$config.'`' : "null").';', 
        'before');
});

if(!function_exists("return_ajax_error")){
    function return_ajax_error($error){
        echo '{"success": false, "message": "'.$error.'"}';
        wp_die();
    }
}

if(wp_doing_ajax()){
    add_action('wp_ajax_wacf7', function(){
        $json = file_get_contents('php://input');
        try{
            $config = (array)json_decode(base64_decode($json));
        }
        catch(Exception $exc){
            return return_ajax_error("Некорректные параметры");
        }
        //$config = valid_config_or_null($config);
        if(!$config)
            return return_ajax_error("Некорректные параметры");
        update_option('wacf7-config', $config ? base64_encode(json_encode($config)) : "");
        echo '{"success": true}';
        wp_die();
    });
}
