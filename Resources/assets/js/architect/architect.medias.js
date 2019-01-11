//------------------------------------------//
//      ARCHITECT MEDIAS MANAGER
//      @syntey-digital - 2018
//------------------------------------------//
architect.medias = {

    _dropzone: null,
    _settings: null,
    _defaults: {
        acceptedFiles : 'image/jpeg,image/png,image/gif',
        maxFilesize : 20, // MB
        paramName : 'file'
    },

    init: function(options)
    {
        this._settings = $.extend({}, this._defaults, options);
        this.initDropzone();
        this.setDatatable();
    },


    initDropzone: function()
    {
        var _this = this;

        var settings = {
            url: _this._settings.urls.store,
            uploadMultiple: false,
            parallelUploads: 1,
            createImageThumbnails : false,
            // acceptedFiles: _this._settings.acceptedFiles,
            addRemoveLinks: false,
            maxFilesize: _this._settings.maxFilesize,
            paramName: _this._settings.paramName,
            /*
            thumbnail: function(file, dataUrl) {
                return false;
            }*/
        };

        this._dropzone = new Dropzone(_this._settings.identifier, settings);

        this._dropzone.on("error", function(file, response) {
            toastr.error(response.errors.file[0]);
        });

        this._dropzone.on("totaluploadprogress", function(progress) {
            $(".progress-bar").parent().addClass("progress-striped active");
            $(".progress-bar").width(progress + "%");
            $(".progress-bar").html(progress + "%");
        });

        this._dropzone.on("maxfilesreached", function() {
            toastr.error('Too many files added !');
        });

        this._dropzone.on("dragenter", function() {
            $('.medias-dropfiles').addClass("active");
        });

        this._dropzone.on("dragleave dragend dragover", function() {
            $('.medias-dropfiles').removeClass("active");
        });

        this._dropzone.on("maxfilesexceeded", function(file) {
            toastr.error('File ' + file.name + ' is too big !');
        });

        this._dropzone.on("queuecomplete", function(file, response) {
            setTimeout(function() {
                $(".progress-bar").parent().removeClass("progress-striped active");
                $(".progress-bar").width("0%");
                $(".progress-bar").html("");
            }, 2000);

            _this._dropzone.removeAllFiles(true);
        });


        this._dropzone.on("success", function(file, response) {
            _this.onSuccessUpload(_this);
        });
    },

    onSuccessUpload: function(_this)
    {
        toastr.success(Lang.get('fields.success'));
        _this.refresh();
    },

    setDatatable: function()
    {
        var _this = this;

        var table = _this._settings.table.DataTable({
    	    language: {
    	        "url": "/modules/architect/plugins/datatables/locales/french.json"
    	    },
    		  processing: true,
          //serverSide: true, Disabled beacuse break the Order
          ordering: true,
    	    pageLength: 20,
          language: {
              url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/"+Lang.get('datatables.json')+".json"
          },
    	    ajax: _this._settings.table.data('url'),
    	    columns: [
    	        // {data: 'id', name: 'id', width: '40'},
              {data: 'preview', name: 'preview'},
  	          {data: 'uploaded_filename', name: 'uploaded_filename'},
              {data: 'type', name: 'type'},
              {data: 'author', name: 'author'},
    	        {data: 'action', name: 'action', orderable: false, searchable: false}
    	    ],
            initComplete: function(settings, json) {

                DataTableTools.init(this, {
                    onDelete: function(response) {
                        toastr.success(response.message, Lang.get('fields.success'), {timeOut: 3000});
                        _this.refresh();
                    },

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

        datatable.ajax.reload();
    },

    initEvents: function()
    {
        var table = this._settings.table;
        var datatable = table.DataTable();
        var _this = this;

        $(document).on('click','.toogle-edit', function(e) {
            e.preventDefault();

            if(_this._editModal !== undefined) {
                _this._editModal.modalOpen($(this).data('id'));
            }
        });

    }
}
