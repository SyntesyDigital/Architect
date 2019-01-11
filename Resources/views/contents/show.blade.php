@extends('architect::layouts.master')

@section('content')
<div id="content-form"
languages="{{ base64_encode(Modules\Architect\Entities\Language::getAllCached()) }}"
users="{{ $users ? base64_encode($users->toJson()) : null }}"
tags="{{ isset($tags) ? base64_encode($tags->toJson()) : null }}"
categories="{{ isset($categories) ? base64_encode(json_encode($categories)) : null }}"
fields="{{ isset($fields) ? base64_encode($fields->toJson()) : null }}"
page="{{ isset($page) ? base64_encode(json_encode($page, true)) : null }}"
pages="{{ isset($pages) ? base64_encode(json_encode($pages,true)) : null }}"
settings="{{ isset($settings) ? base64_encode($settings) : null }}"
@if(isset($typology)) typology="{{base64_encode($typology->toJson())}}" @endif
@if(isset($content)) content="{{base64_encode($content->toJson())}}" @endif
></div>
@stop

@push('plugins')
    {{ Html::script('/modules/architect/plugins/dropzone/dropzone.min.js') }}
    {{ HTML::style('/modules/architect/plugins/dropzone/dropzone.min.css') }}
    {{ Html::script('/modules/architect/plugins/datatables/datatables.min.js') }}
    {{ HTML::style('/modules/architect/plugins/datatables/datatables.min.css') }}
    {{ Html::script('/modules/architect/plugins/bootbox/bootbox.min.js') }}
    {{ Html::script('/modules/architect/js/libs/datatabletools.js') }}
    {{ Html::script('/modules/architect/js/architect.js') }}
@endpush

@push('javascripts-libs')
<script>
var routes = {
  'contents' : "{{route('contents')}}",
  'medias.data' : "{{route('medias.data')}}",
  'medias.index' : '{{ route('medias.index') }}',
  'medias.store' : '{{ route('medias.store') }}',
  'medias.show' : '{{ route('medias.show') }}',
  'medias.delete' : '{{ route('medias.delete') }}',
  'medias.update' : '{{ route('medias.update') }}',
  'contents.data' : '{{ route('contents.modal.data') }}',
  'showContent' : "{{route('contents.show',['id' => ':id'])}}",
  'contents.page.create' : "{{route('contents.page.create')}}",
  'contents.create' : "{{route('contents.create',['typology' => ':id'])}}",
  'previewContent' : ASSETS+DEFAULT_LOCALE+"/preview/:id",
  'pagelayouts.data' : '{{ route('pagelayouts.modal.data') }}'
};
</script>
@endpush
