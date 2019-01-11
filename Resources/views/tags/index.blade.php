@extends('architect::layouts.master')

@section('content')


<div class="container leftbar-page">

  @include('architect::partials.content-nav',['typologies' => $typologies])

  <div class="col-xs-offset-2 col-xs-10 page-content">

    <h3 class="card-title">{{Lang::get('architect::fields.tags')}}</h3>
    <a href="{{route('tags.create')}}" class="btn btn-primary"><i class="fa fa-plus-circle"></i> &nbsp; {{Lang::get('architect::tag.add')}}</a>

    <table class="table" id="table-tags" data-url="{{route('tags.data')}}">
        <thead>
           <tr>
               <th>{{Lang::get('architect::fields.name')}}</th>
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
    architect.tags.init({
        'table' : $('#table-tags'),
        'urls': {
            'index' : '{{ route('contents.data') }}',
            'show' : '{{ route('contents.show') }}',
            'delete' : '{{ route('contents.delete') }}',
        }
    })
</script>
@endpush
