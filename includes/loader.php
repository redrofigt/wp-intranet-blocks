<?php
/**
 * Register the render callbacks before blocks are registered.
 *
 * @package IntranetBlocks
 */

declare( strict_types = 1 );

namespace IntranetBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once INTRANET_BLOCKS_PATH . 'includes/class-render.php';
