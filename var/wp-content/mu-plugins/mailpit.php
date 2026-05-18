<?php
/**
 * Route local WordPress mail through Mailpit.
 *
 * This file is loaded automatically as a must-use plugin in the Docker
 * environment. It only changes mail transport for local development.
 */

add_action(
    'phpmailer_init',
    static function (PHPMailer\PHPMailer\PHPMailer $phpmailer): void {
        if (function_exists('wp_get_environment_type') && wp_get_environment_type() !== 'local') {
            return;
        }

        $phpmailer->isSMTP();
        $phpmailer->Host = getenv('WORDPRESS_MAILPIT_HOST') ?: 'mailpit';
        $phpmailer->Port = (int) (getenv('WORDPRESS_MAILPIT_PORT') ?: 1025);
        $phpmailer->SMTPAuth = false;
        $phpmailer->SMTPSecure = '';
        $phpmailer->SMTPAutoTLS = false;
    }
);
