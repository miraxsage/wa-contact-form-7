<?php
/*
Plugin Name: WebArch ContactForm7 Plugin
Description: Плагин расширения функциональности Wordpress ContactForm7
Author: WebArchitect
Version: 1.0.0
Author URI: https://webarchitect.ru/
*/

$dir_sep = DIRECTORY_SEPARATOR;
define("WACF7_PLUGIN_DIR", preg_replace("|[\\/]$|", "", plugin_dir_path(__FILE__)).$dir_sep);
define("WACF7_PLUGIN_URI", plugin_dir_url(__FILE__));
define("WACF7_ADMIN_BUILD_DIR", WACF7_PLUGIN_DIR."assets{$dir_sep}js{$dir_sep}admin-panel{$dir_sep}build{$dir_sep}");
define("WACF7_BUILD_DIR", WACF7_PLUGIN_DIR."assets{$dir_sep}js{$dir_sep}admin-panel{$dir_sep}build{$dir_sep}");
define("WACF7_ADMIN_BUILD_URI", WACF7_PLUGIN_URI."assets/js/admin-panel/build/");
define("WACF7_SITE_BUILD_URI", WACF7_PLUGIN_URI."assets/js/site-content/build/");

define("WACF7_LOGS_TB", $GLOBALS['wpdb']->prefix."wacf7_logs");
define("WACF7_LOGS_FIELDS_TB", $GLOBALS['wpdb']->prefix."wacf7_logs_fields");

require_once WACF7_PLUGIN_DIR . 'functions.php';
