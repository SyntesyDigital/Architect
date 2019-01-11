@extends('architect::layouts.master')

@section('content')


<div class="container leftbar-page">

  <div class="col-xs-offset-2 col-xs-10 page-content">

    <h3 class="card-title">{{Lang::get('architect::settings.users')}}</h3>
    <a href="{{route('users.create')}}" class="btn btn-primary"><i class="fa fa-plus-circle"></i> &nbsp; {{Lang::get('architect::user.add')}}</a>

    <table class="table" id="table" data-url="{{route('users.data')}}">
        <thead>
           <tr>
               <th>{{Lang::get('architect::datatables.name')}}</th>
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
    architect.users.init({
        'table' : $('#table'),
        'urls': {
            'index' : '{{ route('users.data') }}',
            'show' : '{{ route('users.show') }}',
            'delete' : '{{ route('users.delete') }}',
        }
    })
</script>
@endpush
