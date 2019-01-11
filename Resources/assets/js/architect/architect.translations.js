//------------------------------------------//
//      ARCHITECT TRADUCCIONS MANAGER
//      @syntey-digital - 2018
//------------------------------------------//
architect.translations = {

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
                {data: 'order', name: 'order'},
                {data: 'name', name: 'name'},
                {data: 'value', name: 'value'},
    	        {data: 'action', name: 'action', orderable: false, searchable: false}
    	    ],
          rowReorder: {
            dataSrc: 'order'
          },
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


        table.on('row-reorder', function ( e, diff, edit ) {
          var newOrder = [];

          for ( var i=0, ien=diff.length ; i<ien ; i++ ) {
            var rowData = table.row( diff[i].node ).data();
            newOrder.push({
              id : rowData['id'],
              newOrder : diff[i].newData
            });
          }

          if(newOrder.length > 0){

            $.ajax({
              type: 'POST',
              url: update_order_url,
              data: {
                _token: csrf_token,
                order : newOrder
              },
              dataType: 'html',
              success: function(data){
                console.log(data);
                  var rep = JSON.parse(data);
                  if(rep.code == 200){
                      //change
                      toastr.success('success', Lang.get('fields.save'), {timeOut: 3000});
                  }
                  else if(rep.code == 400){
                    //error
                    toastr.error(Lang.get('fields.error'), Lang.get('fields.error'), {timeOut: 3000});
                  }
                  else {
                    //nothing to change
                  }
              }
            });
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

architect.translations.form = {
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
