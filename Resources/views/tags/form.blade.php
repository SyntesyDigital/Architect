@extends('architect::layouts.master')

@section('content')


  {!!
      Form::open([
          'url' => isset($tag) ? route('tags.update', $tag) : route('tags.store'),
          'method' => 'POST',
      ])
  !!}

  <div class="container rightbar-page content">

    <div class="page-bar">
      <div class="container">
        <div class="row">

          <div class="col-md-12">
            <a href="{{route('tags')}}" class="btn btn-default btn-close"> <i class="fa fa-angle-left"></i> </a>
            <h1>
              <i class="fa fa-tag "></i>
              {{Lang::get('architect::tag.new')}}
            </h1>

            <div class="float-buttons pull-right">

            <div class="actions-dropdown">
              <a href="#" class="dropdown-toggle btn btn-default" data-toggle="dropdown" aria-expanded="false">
                {{Lang::get('architect::fields.actions')}}
                <b class="caret"></b>
                <div class="ripple-container"></div>
              </a>
                <ul class="dropdown-menu dropdown-menu-right default-padding">
                    <li class="dropdown-header"></li>
                    <li>
                        <a href="{{route('account')}}">
                            <i class="fa fa-plus-circle"></i>
                            &nbsp;{{Lang::get('architect::fields.new')}}
                    </li>
                    <li>
                        <a href="{{route('account')}}" class="text-danger">
                            <i class="fa fa-trash text-danger"></i>
                            &nbsp;
                            <span class="text-danger">{{Lang::get('architect::fields.delete')}}</span>
                        </a>
                    </li>
                </ul>
              </div>


              {!!
                  Form::submit(Lang::get('architect::fields.save'), [
                      'class' => 'btn btn-primary'
                  ])
              !!}

              <!--
              <a href="" class="btn btn-primary" > <i class="fa fa-cloud-upload"></i> &nbsp; Guardar </a>
              -->
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="container rightbar-page content">


      <div class="col-xs-8 col-xs-offset-2 page-content">
        <div class="field-group">

              @if($errors->any())
                  <ul class="alert alert-danger">
                      @foreach ($errors->all() as $error)
                          <li >{{ $error }}</li>
                      @endforeach
                  </ul>
              @endif

              @if (session('success'))
                  <div class="alert alert-success">
                      {{ session('success') }}
                  </div>
              @endif

              @if (session('error'))
                  <div class="alert alert-danger">
                      {{ session('error') }}
                  </div>
              @endif


              @if(isset($tag))
                  {!! Form::hidden('_method', 'PUT') !!}
              @endif

              @foreach(Modules\Architect\Entities\Tag::FIELDS as $field)
                  @switch($field["type"])
                      @case('text')
                          <div class="field-item">
                              <div id="heading" class="btn btn-link" data-toggle="collapse" data-target="#collapse{{ $field['identifier'] }}" aria-expanded="true" aria-controls="collapse{{ $field['identifier'] }}">
                                  <span class="field-type">
                                      <i class="fa fa-font"></i> {{ ucfirst($field['type']) }}
                                  </span>
                                  <span class="field-name">
                                      {{ $field['name'] }}
                                  </span>
                              </div>

                              <div id="collapse{{ $field['identifier'] }}" class="collapse in" aria-labelledby="heading{{ $field['identifier'] }}" aria-expanded="true" aria-controls="collapse{{ $field['identifier'] }}">
                                  <div class="field-form">
                                      @foreach(Modules\Architect\Entities\Language::getAllCached() as $language)
                                          <div class='form-group bmd-form-group'>
                                              <label class="bmd-label-floating">{{ $field['name'] }} - {{ $language->iso }}</label>

                                              @php
                                                  $fieldName = "fields[" . $field['name'] . "][" . $language->id . "]";
                                              @endphp

                                              {!!
                                                  Form::text(
                                                      $fieldName,
                                                      isset($tag) ? $tag->getFieldValue($field['identifier'], $language->id) : old($fieldName),
                                                      [
                                                          'class' => 'form-control input-source',
                                                          'data-lang' => $language->iso
                                                      ]
                                                  )
                                              !!}

                                          </div>
                                      @endforeach()
                                  </div>
                              </div>
                          </div>
                      @break

                      @case('slug')
                          <div class="field-item">
                              <div id="heading" class="btn btn-link" data-toggle="collapse" data-target="#collapse{{ $field['identifier'] }}" aria-expanded="true" aria-controls="collapse{{ $field['identifier'] }}">
                                  <span class="field-type">
                                      <i class="fa fa-font"></i> {{ ucfirst($field['type']) }}
                                  </span>
                                  <span class="field-name">
                                      {{ $field['name'] }}
                                  </span>
                              </div>

                              <div id="collapse{{ $field['identifier'] }}" class="collapse in" aria-labelledby="heading{{ $field['identifier'] }}" aria-expanded="true" aria-controls="collapse{{ $field['identifier'] }}">
                                  <div class="field-form">
                                      @foreach(Modules\Architect\Entities\Language::getAllCached() as $language)
                                          <div class='form-group bmd-form-group'>
                                              <label class="bmd-label-floating">{{ $field['name'] }} - {{ $language->iso }}</label>

                                              @php
                                                  $fieldName = "fields[" . $field['name'] . "][" . $language->id . "]";
                                              @endphp

                                              {!!
                                                  Form::text(
                                                      $fieldName,
                                                      isset($tag) ? $tag->getFieldValue($field['identifier'], $language->id) : old($fieldName),
                                                      [
                                                          'class' => 'form-control input-target ',
                                                          'data-lang' => $language->iso
                                                      ]
                                                  )
                                              !!}

                                          </div>
                                      @endforeach()
                                  </div>
                              </div>
                          </div>
                      @break

                      @case('richtext')
                          <div class="field-item">
                              <div id="heading" class="btn btn-link" data-toggle="collapse" data-target="#collapse{{ $field['identifier'] }}" aria-expanded="true" aria-controls="collapse{{ $field['identifier'] }}">
                                  <span class="field-type">
                                      <i class="fa fa-font"></i> {{ ucfirst($field['type']) }}
                                  </span>
                                  <span class="field-name">
                                      {{ $field['name'] }}
                                  </span>
                              </div>

                              <div id="collapse{{ $field['identifier'] }}" class="collapse in" aria-labelledby="heading{{ $field['identifier'] }}" aria-expanded="true" aria-controls="collapse{{ $field['identifier'] }}">
                                  <div class="field-form">
                                      @foreach(Modules\Architect\Entities\Language::getAllCached() as $language)
                                          <div class='form-group bmd-form-group'>
                                              <label class="bmd-label-floating">{{ $field['name'] }} - {{ $language->iso }}</label>

                                              @php
                                                  $fieldName = "fields[" . $field['name'] . "][" . $language->id . "]";
                                              @endphp

                                              {!!
                                                  Form::textarea(
                                                      $fieldName,
                                                      isset($tag) ? $tag->getFieldValue($field['identifier'], $language->id) : old($fieldName),
                                                      [
                                                          'class' => 'form-control'
                                                      ]
                                                  )
                                              !!}

                                          </div>


                                      @endforeach()
                                  </div>
                              </div>
                          </div>
                      @break

                  @endswitch
              @endforeach()

            </div>
          </div>

      </div>



    </div>

    {!! Form::close() !!}

@stop

@push('javascripts')
<script>

  $(function(){

    var slugifyTitle = function(sourceValue){
      return slugify(sourceValue, {
				replacement: '-',
				remove: /[$*+~.,()'"!\-\?\¿`´:@]/g,
				lower: true
			});
    };

    $(".input-source").keyup(function(e){
      var isoCode = $(e.target).data('lang');
      var slug = slugifyTitle(e.target.value);
      $(".input-target[data-lang='"+isoCode+"']").val(slug);

    });

  });

</script>
@endpush
