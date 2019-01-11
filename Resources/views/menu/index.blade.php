@extends('architect::layouts.master')

@section('content')
<div class="container leftbar-page">
  <div class="col-xs-offset-2 col-xs-8 page-content">

    <h3 class="card-title">{{Lang::get('architect::settings.menu')}}</h3>
    <a href="{{route('menu.create')}}" class="btn btn-primary"><i class="fa fa-plus-circle"></i> &nbsp; {{Lang::get('architect::menus.add')}}</a>

    <table class="table" id="table" data-url="{{route('menu.data')}}">
        <thead>
           <tr>
               <th>{{Lang::get('architect::fields.name')}}</th>
               <th></th>
           </tr>
        </thead>

        <tbody>
          <tr>
              <th></th>
              <th></th>
          </tr>
        </tbody>
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
    architect.menu.init({
        'table' : $('#table')
    })
</script>
@endpush
