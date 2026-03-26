<?php
$uploads = wp_get_upload_dir();
$base    = trailingslashit($uploads["basedir"]);

$attachments = get_posts([
    "post_type"      => "attachment",
    "post_status"    => "inherit",
    "posts_per_page" => -1,
    "fields"         => "ids",
]);

foreach ($attachments as $id) {
    $relative = get_post_meta($id, "_wp_attached_file", true);

    if (!$relative) {
        echo "NO_META\t{$id}\t" . get_the_title($id) . PHP_EOL;
        continue;
    }

    $file = $base . $relative;

    if (!file_exists($file)) {
        echo "MISSING\t{$id}\t{$relative}\t" . get_the_title($id) . PHP_EOL;
    }
}
