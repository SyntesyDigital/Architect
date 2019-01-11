@extends('architect::layouts.master')

@section('content')


  {!!
      Form::open([
          'url' => isset($language) ? route('languages.update', $language) : route('languages.store'),
          'method' => 'POST',
      ])
  !!}

  <div class="container rightbar-page content">

    <div class="page-bar">
      <div class="container">
        <div class="row">

          <div class="col-md-12">
            <a href="{{route('languages')}}" class="btn btn-default btn-close"> <i class="fa fa-angle-left"></i> </a>
            <h1>
              <i class="fa fa-flag"></i>
              {{Lang::get('architect::language.new')}}
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
                        <a href="{{route('languages.create')}}">
                            <i class="fa fa-plus-circle"></i>
                            &nbsp;{{Lang::get('architect::fields.new')}}
                        </a>
                    </li>
                    @if(isset($language))
                    <li>
                        <a href="{{route('languages.create')}}"
                            class="text-danger"
                            data-toogle="delete"
                            data-ajax="{{route('languages.delete', $language)}}"
                            data-confirm-message="{{Lang::get('architect::language.del_lang_msg')}}"
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


              @if(isset($language))
                  {!! Form::hidden('_method', 'PUT') !!}
              @endif


              <div class="field-item">
                  <div id="heading" class="btn btn-link" data-toggle="collapse" data-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                      <span class="field-type">
                          <i class="fa fa-font"></i> {{Lang::get('architect::fields.text')}}
                      </span>
                      <span class="field-name">
                          {{Lang::get('architect::fields.name')}}
                      </span>
                  </div>

                  <div id="collapse1" class="collapse in" aria-labelledby="heading1" aria-expanded="true" aria-controls="collapse1">
                      <div class="field-form">
                          <div class='form-group bmd-form-group'>
                              <label class="bmd-label-floating">{{Lang::get('architect::fields.name')}}</label>

                              {!!
                                  Form::text(
                                      'name',
                                      isset($language) ? $language->name : old('name'),
                                      [
                                          'class' => 'form-control'
                                      ]
                                  )
                              !!}

                          </div>
                      </div>
                  </div>
              </div>

              <div class="field-item">
                  <div id="heading" class="btn btn-link" data-toggle="collapse" data-target="#collapse2" aria-expanded="true" aria-controls="collapse2">
                      <span class="field-type">
                          <i class="fa fa-font"></i> {{Lang::get('architect::fields.text')}}
                      </span>
                      <span class="field-name">
                           {{Lang::get('architect::datatables.iso')}}
                      </span>
                  </div>

                  <div id="collapse2" class="collapse in" aria-labelledby="heading1" aria-expanded="true" aria-controls="collapse2">
                      <div class="field-form">
                          <div class='form-group bmd-form-group'>
                              <label class="bmd-label-floating">{{Lang::get('architect::datatables.iso')}}</label>

                              {!!
                                  Form::text(
                                      'iso',
                                      isset($language) ? $language->iso : old('iso'),
                                      [
                                          'class' => 'form-control'
                                      ]
                                  )
                              !!}

                          </div>
                      </div>
                  </div>
              </div>

              <div class="field-item">
                  <div id="heading" class="btn btn-link" data-toggle="collapse" data-target="#collapse3" aria-expanded="true" aria-controls="collapse3">
                      <span class="field-type">
                          <i class="fa fa-check-square-o"></i> {{Lang::get('architect::fields.boolean')}}
                      </span>
                      <span class="field-name">
                          {{Lang::get('architect::language.default_question')}}

                      </span>
                  </div>

                  <div id="collapse3" class="collapse in" aria-labelledby="heading1" aria-expanded="true" aria-controls="collapse3">
                      <div class="field-form">
                          <div class='form-group bmd-form-group'>
                            <div class='togglebutton'>
                              <label>
                                  {{Lang::get('architect::language.default_question')}}
                                  <input
                                    type="checkbox"
                                    name="default"
                                    @if(isset($language) && $language->default == 1)
                                    checked="true"
                                    @endif
                                  />
                              </label>
                            </div>

                          </div>
                      </div>
                  </div>
              </div>

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
    architect.languages.form.init({
      reloadRoute : "{{route('languages')}}"
    })
</script>
@endpush
