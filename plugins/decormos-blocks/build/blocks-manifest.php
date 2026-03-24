<?php
// This file is generated. Do not modify it manually.
return array(
	'header' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'decormos/header',
		'version' => '0.1.0',
		'title' => 'Header',
		'category' => 'design',
		'icon' => 'align-wide',
		'description' => 'Шапка сайта Decormos',
		'example' => array(
			
		),
		'attributes' => array(
			'menuId' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'decormos-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	)
);
