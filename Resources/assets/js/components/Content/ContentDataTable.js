import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ContentDataTable extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
          fields : [],
          init : false
        };
    }

    componentDidMount()
    {
      //this.setDatatable();
      this.initEvents();
    }

    componentWillReceiveProps(nextProps)
    {
      if(nextProps.init !== undefined && nextProps.init == true){
        if(!this.state.init){
          this.setState({
            init : true
          });
          this.setDatatable(nextProps.route);
        }
      }
      else {
        if(this.state.init){
          this.setState({
            init : false
          });
          this.destroyDatatable();
        }
      }
    }

    setDatatable(route)
    {

        console.log("ContentDataTable :: setDatatable route : ",route,$(this.refs.main));

        var _this = this;
        var table = $(this.refs.main).DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/"+Lang.get('datatables.json')+".json"
            },
            processing: true,
            serverSide: true,
            order: [],
            pageLength: 10,
            ajax: route,
            columns: [
                // {data: 'id', name: 'id', width: '40'},
                {data: 'title', name: 'title'},
                {data: 'typology', name: 'typology'},
                {data: 'updated', name: 'updated'},
                {data: 'author', name: 'author'},
                {data: 'status', name: 'status'},
                {data: 'action', name: 'action', orderable: false, searchable: false}
            ],
            initComplete: function(settings, json) {
                //_this.initEvents();
            }
        });
    }

    destroyDatatable() {

      console.log("ContentDataTable :: destroy datatable ");

      $(this.refs.main).DataTable().destroy();
    }

    addField()
    {

    }

    initEvents()
    {
        var _this = this;
        $(document).on('click','#table-contents .add-item',function(e){
          e.preventDefault();
          var content = $(this).data('content');
          content = JSON.parse(atob(content));

          _this.props.onSelectItem(content);
        });
    }

    render() {
        return (
          <div>
            <table ref="main" className="table" id="table-contents" style={{width:"100%"}}>
                <thead>
                   <tr>
                       <th>{Lang.get('fields.name')}</th>
                       <th>{Lang.get('fields.tipus')}</th>
                       <th>{Lang.get('fields.updated')}</th>
                       <th>{Lang.get('fields.author')}</th>
                       <th>{Lang.get('fields.status')}</th>
                       <th></th>
                   </tr>
                </thead>
                <tfoot>
                   <tr>
                       <th></th>
                       <th></th>
                       <th></th>
                       <th></th>
                       <th></th>
                       <th></th>
                   </tr>
                </tfoot>
            </table>
          </div>
        );
    }
}

export default ContentDataTable;
