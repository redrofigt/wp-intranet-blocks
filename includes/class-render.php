<?php
/**
 * Server-side render callbacks for the dynamic blocks.
 *
 * All output is escaped. Queries use whitelisted attributes only —
 * every attribute is re-validated here before it can touch a query.
 *
 * @package IntranetBlocks
 */

declare( strict_types = 1 );

namespace IntranetBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * News Card render callback.
 *
 * @param array<string, mixed> $attributes Block attributes.
 * @return string
 */
function news_card( array $attributes ): string {
	$allowed_layouts = array( 'grid', 'featured', 'list' );
	$layout          = in_array( $attributes['layout'] ?? 'grid', $allowed_layouts, true ) ? $attributes['layout'] : 'grid';

	$query = new \WP_Query(
		array(
			'post_type'           => 'post',
			'posts_per_page'      => min( 24, max( 1, (int) ( $attributes['postCount'] ?? 4 ) ) ),
			'ignore_sticky_posts' => false,
			'no_found_rows'       => true,
		)
	);

	if ( ! $query->have_posts() ) {
		return '<div class="nh-news nh-news--empty">' . esc_html__( 'No news yet.', 'intranet-blocks' ) . '</div>';
	}

	$out = sprintf( '<div class="nh-news nh-news--%s">', esc_attr( $layout ) );

	while ( $query->have_posts() ) {
		$query->the_post();

		$thumb = get_the_post_thumbnail( get_the_ID(), 'medium_large', array( 'loading' => 'lazy' ) );

		$out .= sprintf(
			'<article class="nh-news__card"><a class="nh-news__link" href="%1$s">%2$s<div class="nh-news__body">%3$s%4$s%5$s</div></a></article>',
			esc_url( (string) get_permalink() ),
			$thumb ? wp_kses_post( $thumb ) : '',
			sprintf( '<h3 class="nh-news__title">%s</h3>', esc_html( get_the_title() ) ),
			! empty( $attributes['showExcerpt'] ) ? sprintf( '<p class="nh-news__excerpt">%s</p>', esc_html( wp_trim_words( get_the_excerpt(), 22 ) ) ) : '',
			! empty( $attributes['showDate'] ) ? sprintf( '<time class="nh-news__date" datetime="%1$s">%2$s</time>', esc_attr( get_the_date( 'c' ) ), esc_html( get_the_date() ) ) : ''
		);
	}

	wp_reset_postdata();

	return $out . '</div>';
}

/**
 * Quick Action Tile render callback.
 *
 * @param array<string, mixed> $attributes Block attributes.
 * @return string
 */
function quick_action( array $attributes ): string {
	$allowed_icons = array( 'calendar', 'headset', 'users', 'file', 'chart' );
	$icon          = in_array( $attributes['icon'] ?? 'calendar', $allowed_icons, true ) ? $attributes['icon'] : 'calendar';
	$label         = sanitize_text_field( (string) ( $attributes['label'] ?? '' ) );
	$url           = esc_url_raw( (string) ( $attributes['url'] ?? '' ) );

	if ( '' === $label || '' === $url ) {
		return '';
	}

	$new_tab = ! empty( $attributes['openInNewTab'] ) ? ' target="_blank" rel="noopener noreferrer"' : '';

	return sprintf(
		'<a class="nh-quick-action" href="%1$s"%4$s><span class="nh-quick-action__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><use href="#nh-icon-%2$s"/></svg></span><span class="nh-quick-action__label">%3$s</span></a>',
		$url,
		esc_attr( $icon ),
		esc_html( $label ),
		$new_tab
	);
}
