@extends('architect::layouts.master')

@section('content')

@include('architect::contents.modal-new')

<div class="container leftbar-page">

  @include('architect::partials.content-nav',[
    'typologies' => $typologies,
    'typology_id' => Request('typology_id'),
    'display_pages' => Request('display_pages')
  ])

  <div class="col-xs-offset-2 col-xs-10 page-content">

    <h3 class="card-title"> {{Lang::get('architect::contents.contents')}}</h3>
    <a href="#" class="btn btn-primary"><i class="fa fa-plus-circle"></i> &nbsp; {{Lang::get('architect::contents.add')}}</a>

    <table class="table" id="table-contents" data-url="{{route('contents.data', request()->all())}}">
        <thead>
           <tr>
               <th> {{Lang::get('architect::fields.name')}}</th>
               <th>{{Lang::get('architect::fields.tipus')}}</th>
               <th>{{Lang::get('architect::fields.updated')}}</th>
               <th data-filter="select" data-values="{{base64_encode($users->toJson())}}">{{Lang::get('architect::fields.author')}}</th>
               <th>{{Lang::get('architect::fields.status')}}</th>
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

</div>
@stop


@push('plugins')
    {{ Html::script('/modules/architect/plugins/datatables/datatables.min.js') }}
    {{ HTML::style('/modules/architect/plugins/datatables/datatables.min.css') }}
    {{ Html::script('/modules/architect/plugins/bootbox/bootbox.min.js') }}
    {{ Html::script('/modules/architect/js/libs/datatabletools.js') }}
    {{ Html::script('/modules/architect/js/architect.js') }}
@endpush

@push('javascripts-libs')
<script>
    architect.contents.init({
        'table' : $('#table-contents'),
        'urls': {
            'index' : '{{ route('contents.data') }}',
            'store' : '{{ route('contents.store') }}',
            'show' : '{{ route('contents.show') }}',
            'delete' : '{{ route('contents.delete') }}',
            'update' : '{{ route('contents.update') }}'
        }
    })
</script>
@endpush


@push('javascripts')

<script>
$(function(){

  $(".btn-primary").click(function(e){
    e.preventDefault();
    TweenMax.to($("#new-content-modal"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
  });

  $(document).on('click',"#new-content-modal .close-btn",function(e){
    e.preventDefault();
    TweenMax.to($("#new-content-modal"),0.5,{opacity:0,display:"none",ease:Power2.easeInOut});
  });

});
</script>

@endpush
