/**
 * News Card block — dynamic (server-rendered) block.
 *
 * The editor stores only attributes; HTML is generated in render.php so the
 * output always reflects the latest template + theme.json styles. This is the
 * "dynamic rendering" pattern requested by enterprise design systems.
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
	Placeholder,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';

const { name } = metadata;

function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	// Live post-type + category pickers backed by core data.
	const categories = useSelect( ( select ) =>
		select( coreStore ).getEntityRecords( 'taxonomy', 'category', { per_page: 50 } ) || []
	);

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Card settings', 'intranet-blocks' ) } initialOpen>
					<SelectControl
						label={ __( 'Layout', 'intranet-blocks' ) }
						value={ attributes.layout }
						options={ [
							{ value: 'grid', label: __( 'Grid', 'intranet-blocks' ) },
							{ value: 'featured', label: __( 'Featured', 'intranet-blocks' ) },
							{ value: 'list', label: __( 'List', 'intranet-blocks' ) },
						] }
						onChange={ ( layout ) => setAttributes( { layout } ) }
					/>
					<SelectControl
						label={ __( 'Category', 'intranet-blocks' ) }
						value={ attributes.categoryId }
						options={ [
							{ value: 0, label: __( 'All categories', 'intranet-blocks' ) },
							...categories.map( ( c ) => ( { value: c.id, label: c.name } ) ),
						] }
						onChange={ ( categoryId ) => setAttributes( { categoryId: Number( categoryId ) } ) }
					/>
					<TextControl
						type="number"
						min={ 1 }
						max={ 24 }
						label={ __( 'Number of posts', 'intranet-blocks' ) }
						value={ attributes.postCount }
						onChange={ ( postCount ) => setAttributes( { postCount: Math.min( 24, Math.max( 1, Number( postCount ) || 4 ) ) } ) }
					/>
					<ToggleControl
						label={ __( 'Show excerpt', 'intranet-blocks' ) }
						checked={ attributes.showExcerpt }
						onChange={ ( showExcerpt ) => setAttributes( { showExcerpt } ) }
					/>
					<ToggleControl
						label={ __( 'Show publish date', 'intranet-blocks' ) }
						checked={ attributes.showDate }
						onChange={ ( showDate ) => setAttributes( { showDate } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender
				block={ name }
				attributes={ attributes }
				LoadingResponse={ () => (
					<Placeholder label={ __( 'News Card', 'intranet-blocks' ) }><Spinner /></Placeholder>
				) }
			/>
		</div>
	);
}

registerBlockType( name, {
	edit: Edit,
	// Dynamic block: no save() markup — render.php owns the front-end HTML.
	save: () => null,
} );
