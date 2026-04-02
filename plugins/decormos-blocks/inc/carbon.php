<?php


function decormos_blocks_get_theme_option( string $key, $default = null ) {
	static $cache = array();

	if ( array_key_exists( $key, $cache ) ) {
		return $cache[ $key ];
	}

	$value         = carbon_get_theme_option( $key );
	$cache[ $key ] = $value;

	return $value ?? $default;
}

function decormos_blocks_get_post_meta( int $post_id, string $key, $default = null ) {
	static $cache = array();

	if ( ! isset( $cache[ $post_id ] ) ) {
		$cache[ $post_id ] = array();
	}

	if ( array_key_exists( $key, $cache[ $post_id ] ) ) {
		return $cache[ $post_id ][ $key ];
	}

	$value                     = carbon_get_post_meta( $post_id, $key );
	$cache[ $post_id ][ $key ] = $value;

	return $value ?? $default;
}

function decormos_blocks_get_the_post_meta( string $key, $default = null ) {
	return decormos_blocks_get_post_meta( get_the_ID(), $key, $default );
}

function decormos_blocks_get_term_meta( int $term_id, string $key, $default = null ) {
	static $cache = array();

	if ( ! isset( $cache[ $term_id ] ) ) {
		$cache[ $term_id ] = array();
	}

	if ( array_key_exists( $key, $cache[ $term_id ] ) ) {
		return $cache[ $term_id ][ $key ];
	}

	$value                     = carbon_get_term_meta( $term_id, $key );
	$cache[ $term_id ][ $key ] = $value;

	return $value ?? $default;
}

function decormos_blocks_get_nav_menu_item_meta( int $item_id, string $key, $default = null ) {
	static $cache = array();

	if ( ! isset( $cache[ $item_id ] ) ) {
		$cache[ $item_id ] = array();
	}

	if ( array_key_exists( $key, $cache[ $item_id ] ) ) {
		return $cache[ $item_id ][ $key ];
	}

	$value = function_exists( 'carbon_get_nav_menu_item_meta' )
		? carbon_get_nav_menu_item_meta( $item_id, $key )
		: null;

	$cache[ $item_id ][ $key ] = $value;

	return $value ?? $default;
}
