import React, { Component } from 'react';
import ReactDOM from 'react-dom';



class LayoutDataTable extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
          fields : []
        };
    }

    componentDidMount()
    {

      this._table = $('#table-layouts');

      this.setDatatable();
    }

    setDatatable()
    {

        var _this = this;

        var table = this._table.DataTable({
    	    language: {
    	        "url": "/modules/architect/plugins/datatables/locales/french.json"
    	    },
    		processing: true,
          serverSide: true,
    	    pageLength: 20,
          language: {
              url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/"+Lang.get('datatables.json')+".json"
          },
    	    ajax: this.props.route,
    	    columns: [
    	        // {data: 'id', name: 'id', width: '40'},
              {data: 'name', name: 'name'},
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
    }

    addField()
    {

    }

    initEvents()
    {
        var _this = this;
        $(document).on('click','#table-layouts .add-item',function(e){
          e.preventDefault();
          var content = $(this).data('id');

          //console.log("LayoutDataTable :: ",content);

          _this.props.onSelectItem(content);
        });
    }

    render() {
        return (
          <div>
            <table className="table" id="table-layouts" style={{width:"100%"}}>
                <thead>
                   <tr>
                       <th>{Lang.get('fields.name')}</th>
                       <th></th>
                   </tr>
                </thead>
                <tfoot>
                   <tr>
                       <th></th>
                       <th></th>
                   </tr>
                </tfoot>
            </table>
          </div>
        );
    }
}

export default LayoutDataTable;
