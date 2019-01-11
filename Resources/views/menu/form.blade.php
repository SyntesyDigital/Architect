@extends('architect::layouts.master')

@section('content')




    {!!
        Form::open([
            'url' => '',
            'method' => 'POST',
            'id' => 'menu-form'
        ])
    !!}

    <div class="page-bar">
      <div class="container">
        <div class="row">

          <div class="col-md-12">
            <a href="{{route('menu.index')}}" class="btn btn-default btn-close"> <i class="fa fa-angle-left"></i> </a>
            <h1>
              <i class="fa fa-list "></i>
              @if(isset($menu))
                {{Lang::get('architect::menus.edit')}} "{{$menu->name or ''}}"
              @else
                {{Lang::get('architect::menus.new')}}
              @endif
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
                        <a href="{{route('menu.create')}}">
                            <i class="fa fa-plus-circle"></i>
                            &nbsp;{{Lang::get('architect::fields.new')}}
                        </a>
                    </li>
                    <li>
                        <a href="#" class="text-danger">
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

            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="container rightbar-page content page-builder menu">

        <div class="sidebar">

          <div>
            <div class="form-group bmd-form-group sidebar-item">
               <label htmlFor="name" class="bmd-label-floating">{{Lang::get('architect::fields.name')}}</label>
               <input type="text" class="form-control"  id="name" name="name" value="{{$menu->name or ''}}" />

            </div>

            <hr/>

          </div>

        </div><!-- end sidebar -->

        <div class="col-xs-9 page-content">

          <!-- React Modal Edit Menu -->
          <div id="menu-edit-modal"
            menu="{{$menu->id or null}}"
          ></div>

          @if (session('success'))
              <div class="alert alert-success">
                  {{ session('success') }}
              </div>
          @endif


          <div class="grid-items">
            <div class="row">
              <ol class='sortable-list'>
                <p class="loading-message">
                  {{Lang::get('architect::menus.loading')}}
                </p>
              </ol>
            </div>
          </div>


          <div class="page-row add-row-block">
            <a href="" class="btn btn-default add-new-item">
              <i class="fa fa-plus-circle"></i> {{Lang::get('architect::menus.add_page')}}
            </a>
          </div>

        </div>

    </div>

    <!--

    <div class="container rightbar-page content">
        <div class="col-xs-8 col-xs-offset-2 page-content">
            <div class="field-group">
                <div class="grid-items">
                  <div class="row">
                    <ol class='sortable-list'>
                      Carregant items...
                    </ol>
                  </div>
                </div>
            </div>
        </div>
    </div>
    -->

    {!! Form::close() !!}

@stop

@push('plugins')
    {{ Html::script('/modules/architect/plugins/datatables/datatables.min.js') }}
    {{ HTML::style('/modules/architect/plugins/datatables/datatables.min.css') }}
    {{ Html::script('/modules/architect/js/libs/datatabletools.js') }}
    {{ Html::script('/modules/architect/plugins/bootbox/bootbox.min.js') }}
    {{ Html::script('/modules/architect/js/architect.js') }}
@endpush

@push('javascripts')
<script>

  var routes = {
    'contents.data' : '{{ route('contents.modal.data') }}',
    getData : '{{route("menu.show.tree",isset($menu) ? $menu->id : 0) }}',
    menuStore : '{{route("menu.store")}}',
    menuUpdate : '{{route("menu.update",isset($menu) ? $menu->id : 0)}}',
    menuShow : '{{route("menu.show",":id")}}',
  };

  var csrf_token = "{{csrf_token()}}";

  $(function(){

    architect.menu.form.init({
      menuId : {{$menu->id or 'null'}}
    });

  });
</script>

@endpush
