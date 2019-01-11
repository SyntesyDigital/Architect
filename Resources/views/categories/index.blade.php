@extends('architect::layouts.master')

@section('content')


<div class="container leftbar-page">

  @include('architect::partials.content-nav',['typologies' => $typologies])

  <div class="col-xs-offset-2 col-xs-10 page-content">

    <h3 class="card-title">{{Lang::get('architect::category.categories')}}</h3>
    <a href="{{route('categories.create')}}" class="btn btn-primary"><i class="fa fa-plus-circle"></i> &nbsp; {{Lang::get('architect::category.add')}}</a>

    <div class="grid-items">
      <div class="row">
        <ol class='sortable-list'>
          {{Lang::get('architect::category.loading')}}
        </ol>
      </div>
    </div>

  </div>

</div>


@stop

@push('plugins')
    {{ Html::script('/modules/architect/plugins/bootbox/bootbox.min.js') }}
    {{ Html::script('/modules/architect/js/architect.js') }}
@endpush

@push('javascripts')
<script>

  var csrf_token = "{{csrf_token()}}";

  var routes = {
    showItem : '{{route("categories.show",["id"=>":id"])}}',
    getData : '{{route("categories.data") }}',
    deleteItem : '{{ route("categories.delete",["id"=>":id"]) }}',
    updateOrder : '{{route("categories.update-order")}}'
  };

  $(function(){

    var appendCategory = function(category){

  		var classSelector = "";

  		console.log(category);
  		console.log(category.parent_id);

      if(category.parent_id == null){
  			classSelector = ".sortable-list";
  		}
  		else {
  			classSelector = ".category-container-"+category.parent_id;
  		}

  		$(classSelector).append(''+
  			'<li class="item drag" data-id="'+category.id+'" data-class="category">'+
            '<div class="item-bar">'+
    	  			//'<i class="fa fa-bars"></i> &nbsp; '+category.name+
              category.name+
    	  			'<div class="actions">'+
    		  			'<a href="'+routes.showItem.replace(':id',category.id)+'" class="btn btn-link"><i class="fa fa-pencil"></i> &nbsp; '+Lang.get('fields.edit')+'</a>&nbsp;'+
    		  			'<a href="#" data-ajax="'+routes.deleteItem.replace(':id',category.id)+'" class="btn btn-link text-danger btn-delete"><i class="fa fa-trash"></i> &nbsp; '+Lang.get('fields.delete')+'</a>'+
    		  		'</div>'+
            '</div>'+
  	  			'<ol class="category-container-'+category.id+'">'+
  			  	'</ol>'+
  	  		'</li>'
  		);

  	};

    $.getJSON('{{route("categories.data")}}',function(data){

  		//create tree
  		var items = data;
      var item;

  		$(".sortable-list").empty();

  		for(var id in items){
  			item = items[id];
  			appendCategory(item);
  		}

      var group = $("ol.sortable-list").sortable({
        onDrop: function ($item, container, _super) {

  			    var parent = container.el.parent();
            var data = group.sortable("serialize").get();
  			    _super($item, container);

            updateOrder();
  			}
  		});

      var updateOrder = function() {

  			var newOrder = group.sortable("serialize").get();

        console.log("update Order => ",newOrder);

  			$.ajax({
	            type: 'POST',
	            url: routes.updateOrder,
	            data: {
	            	_token: csrf_token,
	            	order : newOrder
	            },
	            dataType: 'html',
	            success: function(data){

	                var rep = JSON.parse(data);

	                if(rep.success){
	                    //change
	                    toastr.success('Ok', '', {timeOut: 3000});
	                    //location.reload();
	                }
	                else {
	                	//error
	                	toastr.error('Error', '', {timeOut: 3000});
	                }
	            }
  			});

  		};


    });

    /*
    $(document).on('click','.item-bar',function(e){

      var item = $(e.target).closest('.item-bar');

      console.log("item-bar :: clicked!",item);

      if(item.hasClass('collapsed')){
          //item.parent().find('ol').css({display:'block'});
          item.parent().find('ol').slideDown();
          item.removeClass('collapsed');
      }
      else {
        //item.parent().find('ol').css({display:'none'});
        item.parent().find('ol').slideUp();
        item.addClass('collapsed');
      }
    });
    */

    $(document).on('click','.btn-delete',function(e){

        e.preventDefault();

        var ajax = $(this).data('ajax');

        architect.dialog.confirm(Lang.get('datatables.sure'), function(result){
            if(result) {

                if(ajax) {
                    $.ajax({
                        method: 'DELETE',
                        url: ajax,
                        data: {
                            _token: csrf_token,
                        }
                    })
                    .done(function(response) {
                        if(response.success) {
                            toastr.success(Lang.get('fields.edit'), '', {timeOut: 3000});
                            window.location.href = "";

                        } else {
                            toastr.error(Lang.get('fields.deleted_correctly'), '', {timeOut: 3000});
                        }
                    }).fail(function(response){
                        toastr.error(Lang.get('fields.error'), '', {timeOut: 3000});
                    });
                    return;
                }

            }
        });
    });

  });
</script>

@endpush
