var CollectionFilter = wp.media.view.AttachmentFilters.extend({
	id: 'media-attachment-collection-filters',

	createFilters: function() {
		var filters = {};
		_.each( wp.media.view.settings.collections || {}, function(value, index){
			filters[index] = {
				text:	value.name,
				props:	{ collection_id: value.id }
			};
		});
		filters.all = {
			text:		'所有分类',
			props:		{ collection_id: '' },
			priority:	10
		};
		this.filters = filters;
	}
});

var AttachmentsBrowser = wp.media.view.AttachmentsBrowser;
wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
	createToolbar: function() {
		AttachmentsBrowser.prototype.createToolbar.call(this);

		if(this.controller.isModeActive('grid') || this.options.date){

			this.toolbar.set('CollectionFilterLabel', new wp.media.view.Label({
				value:		'按分类筛选',
				attributes: { 'for': 'media-attachment-collection-filters'},
				priority:	-75
			}).render());

			this.toolbar.set('CollectionFilter', new CollectionFilter({
				controller:	this.controller,
				model:		this.collection.props,
				priority:	-75
			}).render());
		}
	}
});