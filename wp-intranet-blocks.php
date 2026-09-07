<?php
/**
 * Plugin Name:       Intranet Blocks
 * Plugin URI:        https://github.com/redrofigt/wp-intranet-blocks
 * Description:       Custom React-based Gutenberg blocks for enterprise intranets: news cards, quick-action tiles, event grids, and document accordions. Dynamic (server-rendered) output, block patterns, theme.json-aware styling, and full RTL/Arabic support.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            redrofigt
 * License:           GPL-2.0-or-later
 * Text Domain:       intranet-blocks
 *
 * @package IntranetBlocks
 */

declare( strict_types = 1 );

namespace IntranetBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'INTRANET_BLOCKS_VERSION', '1.0.0' );
define( 'INTRANET_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );
define( 'INTRANET_BLOCKS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register editor assets + all blocks on init.
 *
 * @return void
 */
function register_blocks(): void {
	// Compiled editor script (React components) from src/ via @wordpress/scripts.
	wp_register_script(
		'intranet-blocks-editor',
		INTRANET_BLOCKS_URL . 'build/index.js',
		array( 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n' ),
		INTRANET_BLOCKS_VERSION,
		true
	);

	wp_register_style(
		'intranet-blocks-editor-style',
		INTRANET_BLOCKS_URL . 'build/index.css',
		array(),
		INTRANET_BLOCKS_VERSION
	);

	wp_register_style(
		'intranet-blocks-style',
		INTRANET_BLOCKS_URL . 'build/style-index.css',
		array(),
		INTRANET_BLOCKS_VERSION
	);

	// Logical-Properties stylesheet: direction-safe by design (no left/right).
	wp_style_add_data( 'intranet-blocks-style', 'rtl', 'replace' );

	register_block_type( INTRANET_BLOCKS_PATH . 'build/blocks/news-card' );
	register_block_type( INTRANET_BLOCKS_PATH . 'build/blocks/quick-action' );
}
add_action( 'init', __NAMESPACE__ . '\register_blocks' );

/**
 * Translation strings for the editor JS.
 *
 * @return void
 */
function set_script_translations(): void {
	wp_set_script_translations( 'intranet-blocks-editor', 'intranet-blocks' );
}
add_action( 'init', __NAMESPACE__ . '\set_script_translations' );

/**
 * Pattern: department portal header (news card grid + quick actions).
 * Registered so editors get a one-click starting layout.
 *
 * @return void
 */
function register_patterns(): void {
	register_block_pattern_category( 'intranet', array( 'label' => __( 'Intranet', 'intranet-blocks' ) ) );

	register_block_pattern(
		'intranet/department-portal-header',
		array(
			'title'      => __( 'Department portal header', 'intranet-blocks' ),
			'categories' => array( 'intranet' ),
			'content'    => '<!-- wp:columns --><div class="wp-block-columns"><!-- wp:column --><div class="wp-block-column">'
				. '<!-- wp:intranet-blocks/news-card {"layout":"featured"} /--></div><!-- /wp:column -->'
				. '<!-- wp:column --><div class="wp-block-column">'
				. '<!-- wp:intranet-blocks/quick-action {"icon":"calendar","label":"Book a room"} /-->'
				. '<!-- wp:intranet-blocks/quick-action {"icon":"headset","label":"IT Service Desk"} /--></div><!-- /wp:column --></div><!-- /wp:columns -->',
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_patterns' );
