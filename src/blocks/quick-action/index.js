/**
 * Quick Action Tile — editor.
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';

const { name } = metadata;

const ICONS = [
	{ value: 'calendar', label: 'Calendar' },
	{ value: 'headset', label: 'Service desk' },
	{ value: 'users', label: 'People' },
	{ value: 'file', label: 'Document' },
	{ value: 'chart', label: 'Reports' },
];

function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Tile settings', 'intranet-blocks' ) } initialOpen>
					<TextControl
						label={ __( 'Label', 'intranet-blocks' ) }
						value={ attributes.label }
						onChange={ ( label ) => setAttributes( { label } ) }
					/>
					<TextControl
						label={ __( 'Link URL', 'intranet-blocks' ) }
						value={ attributes.url }
						onChange={ ( url ) => setAttributes( { url } ) }
					/>
					<SelectControl
						label={ __( 'Icon', 'intranet-blocks' ) }
						value={ attributes.icon }
						options={ ICONS }
						onChange={ ( icon ) => setAttributes( { icon } ) }
					/>
					<ToggleControl
						label={ __( 'Open in new tab', 'intranet-blocks' ) }
						checked={ attributes.openInNewTab }
						onChange={ ( openInNewTab ) => setAttributes( { openInNewTab } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender block={ name } attributes={ attributes } />
		</div>
	);
}

registerBlockType( name, {
	edit: Edit,
	save: () => null,
} );
