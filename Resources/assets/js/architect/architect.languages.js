//------------------------------------------//
//      ARCHITECT LANGUAGES MANAGER
//      @syntey-digital - 2018
//------------------------------------------//
architect.languages = {

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
    	      pageLength: 20,
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/"+Lang.get('datatables.json')+".json"
            },
    	    ajax: _this._settings.table.data('url'),
    	    columns: [
                {data: 'default', name: 'default'},
                {data: 'name', name: 'name'},
                {data: 'iso', name: 'iso'},
    	        {data: 'action', name: 'action', orderable: false, searchable: false}
    	    ],
            initComplete: function(settings, json) {
                DataTableTools.init(this, {
                    onDelete: function(response) {
                        toastr.success(response.message, Lang.get('fields.success'), {timeOut: 3000});
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
        //
    }
}

architect.languages.form = {
    settings: null,
    _defaults: {},

    init: function(options)
    {
        this._settings = $.extend({}, this._defaults, options);
        this.initEvents();
    },

    initEvents: function()
    {
        var self = this;

        $(document).on('click','[data-toogle="delete"]',function(e){
          e.preventDefault();
          var button = $(e.target).closest('[data-toogle="delete"]');
          self._delete(button);
        });
    },

    /*
     *  Delete toogle on button or link (<a href="">...</a>)
     *
     *  Toogle :
     *     data-toogle="delete"
     *  Params :
     *      data-confirm-message="Message we want to display for confirm"
     *      (optional) data-ajax="http://..."
     *      (optional) data-redirect="http://..."
     *
     */
    _delete: function( el)
    {
        var _this = this;

        var ajax = el.data('ajax');
        var redirect = el.data('redirect');
        var confirmMessage = el.data('confirm-message');

        architect.dialog.confirm(confirmMessage, function(result){
            if(result) {

                if(redirect) {
                    window.location = redirect;
                    return;
                }

                if(ajax) {
                    $.ajax({
                        method: 'DELETE',
                        url: ajax,
                        data: {
                            _token: $('meta[name="csrf-token"]').attr('content'),
                        }
                    })
                    .done(function(response) {
                        if(response.success) {
                            if(_this._settings.onDelete !== undefined) {
                                _this._settings.onDelete(response);
                            } else {
                                toastr.success(response.message, Lang.get('fields.success'), {timeOut: 3000});
                            }

                            window.location.href = _this._settings.reloadRoute;

                        } else {
                            toastr.error(response.message, Lang.get('fields.error'), {timeOut: 3000});
                        }
                    }).fail(function(response){
                        toastr.error(response.message, Lang.get('fields.error'), {timeOut: 3000});
                    });
                    return;
                }

            }
        });

    }
}
