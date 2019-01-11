//------------------------------------------//
//      ARCHITECT CONTENT MANAGER
//      @syntey-digital - 2018
//------------------------------------------//
architect.contents = {

    _settings: null,
    _defaults: {},

    init: function(options)
    {
        this._settings = $.extend({}, this._defaults, options);
        this.setDatatable();
    },

    setDatatable: function()
    {
        var _this = this;

        var table = _this._settings.table.DataTable({
    		processing: true,
            serverSide: true,
            order: [],
             pageLength: 10,
              language: {
                  url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/"+Lang.get('datatables.json')+".json"
              },
    	    ajax: _this._settings.table.data('url'),
    	    columns: [
                {data: 'title', name: 'title'},
                {data: 'typology', name: 'typology'},
                {data: 'updated', name: 'updated'},
                {data: 'author', name: 'author'},
                {data: 'status', name: 'status'},
    	        {data: 'action', name: 'action', orderable: false, searchable: false}
    	    ],
            initComplete: function(settings, json) {
                DataTableTools.init(this, {
                    onDelete: function(response) {
                        toastr.success(response.message, 'Succès !', {timeOut: 3000});
                        _this.refresh();
                    }
                });

                _this.initEvents();
    	    }
        });
    },

    refresh: function()
    {
        var _this = this;
        var table = this._settings.table;
        var datatable = table.DataTable();

        datatable.ajax.reload(function(){
            _this.initEvents();
        });
    },

    initEvents: function()
    {
        var _this = this;
        _this._settings.table.find('.toogle-edit')
            .off('click')
            .on('click', function(e) {
                e.preventDefault();

                if(_this._editModal !== undefined) {
                    _this._editModal.modalOpen($(this).data('id'));
                }
            });
    }
}
