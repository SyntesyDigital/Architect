//------------------------------------------//
//      ARCHITECT DIALOG
//      @syntey-digital - 2018
//------------------------------------------//
architect.dialog = {

    confirm: function(msg, _callback) {
        bootbox.confirm({
            message: msg,
            buttons: {
                confirm: {
                    label: Lang.get('fields.si') ,
                    className: 'btn-primary'
                },
                cancel: {
                    label:  Lang.get('fields.no'),
                    className: 'btn-default'
                }
            },
            callback: function (result) {
                _callback(result);
            }
        });
    }

};
