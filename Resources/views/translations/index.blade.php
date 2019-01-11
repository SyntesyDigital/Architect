@extends('architect::layouts.master')

@section('content')
<div class="container leftbar-page">
  <div class="col-xs-offset-2 col-xs-8 page-content">

    <h3 class="card-title">{{Lang::get('architect::settings.translations')}}</h3>
    <a href="{{route('translations.create')}}" class="btn btn-primary"><i class="fa fa-plus-circle"></i> &nbsp; {{Lang::get('architect::translates.add')}}</a>

    <table class="table" id="table" data-url="{{route('translations.data')}}">
        <thead>
           <tr>
               <th>{{Lang::get('architect::translates.order')}}</th>
               <th>{{Lang::get('architect::translates.identifier')}}</th>
               <th>{{Lang::get('architect::translates.default_value')}}</th>
               <th></th>
           </tr>
        </thead>
        <tfoot>
           <tr>
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
    architect.translations.init({
        'table' : $('#table')
    })
    var update_order_url = '{{route('translations.order')}}';
    var csrf_token = "{{csrf_token()}}";
</script>
@endpush
