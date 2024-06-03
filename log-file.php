<?php

$wp_root = dirname(dirname(dirname(__DIR__)));

require_once($wp_root.DIRECTORY_SEPARATOR.'wp-load.php');

if (!current_user_can( 'manage_options' ) ) {
    echo "You don't have rights";
    return;
} 

if(!isset($_GET["form"]) || preg_match("|^\d+$|", $_GET["form"]) !== 1){
    echo "Wrong parameters";
    return;
} 
$form_id = $_GET["form"];

global $wpdb;

$wacf7_logs_tb = $wpdb->prefix."wacf7_logs";
$wacf7_logs_fields_tb = $wpdb->prefix."wacf7_logs_fields";

$cols = [];
$names = $wpdb->get_results("select distinct name from $wacf7_logs_fields_tb where form_id = $form_id", ARRAY_N);
foreach($names as $name)
    $cols[] = $name[0];

$empty_vals = [];
foreach($cols as $col){
    $empty_vals[$col] = "";
}

function write_line($file, $vals){
    $i = 0;
    $length = count($vals);
    foreach($vals as $val){
        $sanitized_val = $val;
        if(preg_match("|[;,\"']|i", $val) === 1)
            $sanitized_val = '"'.str_replace('"', '""', $val).'"';
        fwrite($file, $sanitized_val);
        if($i++ < $length) 
            fwrite($file, ";");
    }
    fwrite($file, "\r\n");
}

$file = tmpfile();
fwrite($file, "\xEF\xBB\xBF");
$first = true;
foreach($cols as $col){
    fwrite($file, ($first ? "" : ";").$col);
    $first = false;
}
fwrite($file, "\r\n");

$vals = [];
$fields = $wpdb->get_results("select * from $wacf7_logs_fields_tb where form_id = $form_id", ARRAY_A);

$last_num = -1;
foreach($fields as $field){
    if($field["form_log_num"] != $last_num){
        if($last_num != -1)
            write_line($file, $vals);
        $vals = [...$empty_vals];
        $last_num = $field["form_log_num"];
    }
    $vals[$field["name"]] = $field["value"];
}
write_line($file, $vals);

fseek($file, 0);

header("Content-Type: text/csv; charset=utf-8");
header("Content-Length: " . fstat($file)["size"]);
fpassthru($file);
exit;







