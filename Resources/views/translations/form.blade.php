@extends('architect::layouts.master')

@section('content')

  {!!
      Form::open([
          'url' => isset($translation) ? route('translations.update', $translation) : route('translations.store'),
          'method' => 'POST',
      ])
  !!}

  <div class="container rightbar-page content">

    <div class="page-bar">
      <div class="container">
        <div class="row">

          <div class="col-md-12">
            <a href="{{route('translations')}}" class="btn btn-default btn-close"> <i class="fa fa-angle-left"></i> </a>
            <h1>
              <i class="fa fa-list-alt"></i>
              {{Lang::get('architect::translates.new')}}
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
                        <a href="{{route('translations.create')}}">
                            <i class="fa fa-plus-circle"></i>
                            &nbsp;{{Lang::get('architect::fields.new')}}
                        </a>
                    </li>
                    @if(isset($translation))
                    <li>
                        <a href="{{route('translations.create')}}"
                            class="text-danger"
                            data-toogle="delete"
                            data-ajax="{{route('translations.delete', $translation)}}"
                            data-confirm-message="{{Lang::get('architect::datatable.continue')}}"
                        >
                            <i class="fa fa-trash text-danger"></i>
                            &nbsp;
                            <span class="text-danger">{{Lang::get('architect::fields.delete')}}</span>
                        </a>
                    </li>
                    @endif
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


              @if(isset($translation))
                  {!! Form::hidden('_method', 'PUT') !!}
              @endif


              <div class="field-item">
                  <div id="heading" class="btn btn-link" data-toggle="collapse" data-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                      <span class="field-type">
                          <i class="fa fa-font"></i> {{Lang::get('architect::fields.text')}}
                      </span>
                      <span class="field-name">
                          {{Lang::get('architect::translates.identifier')}}
                      </span>
                  </div>

                  <div id="collapse1" class="collapse in" aria-labelledby="heading1" aria-expanded="true" aria-controls="collapse1">
                      <div class="field-form">
                          <div class='form-group bmd-form-group'>
                              <label class="bmd-label-floating">{{Lang::get('architect::translates.identifier')}}</label>

                              {!!
                                  Form::text(
                                      'name',
                                      isset($translation) ? $translation->name : old('name'),
                                      [
                                          'class' => 'form-control'
                                      ]
                                  )
                              !!}

                          </div>
                      </div>
                  </div>
              </div>

              @foreach(Modules\Architect\Entities\Translation::FIELDS as $field)

                  @switch($field["type"])
                      @case('text')
                          <div class="field-item">
                              <div id="heading" class="btn btn-link" data-toggle="collapse" data-target="#collapse{{ $field['identifier'] }}" aria-expanded="true" aria-controls="collapse{{ $field['identifier'] }}">
                                  <span class="field-type">
                                      <i class="fa fa-font"></i> {{Lang::get('architect::fields.text')}}
                                  </span>
                                  <span class="field-name">
                                      {{ $field['name'] }}
                                  </span>
                              </div>

                              <div id="collapse{{ $field['identifier'] }}" class="collapse in" aria-labelledby="heading{{ $field['identifier'] }}" aria-expanded="true" aria-controls="collapse{{ $field['identifier'] }}">
                                  <div class="field-form">
                                      @foreach(Modules\Architect\Entities\Language::getAllCached() as $language)

                                          <div class='form-group bmd-form-group'>
                                              <label class="bmd-label-floating">{{ $field['name'] }} - {{ $language->name }}</label>
                                              @php
                                                  $fieldName = "fields[" . $field['identifier'] . "][" . $language->id . "]";
                                              @endphp
                                              {!!
                                                  Form::text(
                                                      $fieldName,
                                                      isset($translation) ? $translation->getFieldValue($translation->name, $language->id) : old($fieldName),
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

@push('plugins')
    {{ Html::script('/modules/architect/plugins/bootbox/bootbox.min.js') }}
    {{ Html::script('/modules/architect/js/architect.js') }}
@endpush

@push('javascripts-libs')
<script>
    architect.translations.form.init({
      reloadRoute : "{{route('translations')}}"
    })
</script>
@endpush
