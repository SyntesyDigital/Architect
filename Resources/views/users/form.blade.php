@extends('architect::layouts.master')

@section('content')

    {!!
        Form::open([
            'url' => isset($user) ? route('users.update', $user) : route('users.store'),
            'method' => 'POST',
        ])
    !!}

    @if(isset($user))
        {!! Form::hidden('_method', 'PUT') !!}
    @endif

    <div class="container rightbar-page content">


      {{-- <div class="page-bar">
        <div class="container">
          <div class="row">

            <div class="col-md-12">
              <a href="{{route('users')}}" class="btn btn-default btn-close"> <i class="fa fa-angle-left"></i> </a>

              <div class="float-buttons pull-right">
              </div>

            </div>
          </div>
        </div>
      </div> --}}

    <div class="container rightbar-page content">
        <div class="col-xs-6 col-xs-offset-3 page-content">

            @if (session('success'))
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            @endif

            <div class="row">
                <div class="col-md-12">
                    @if(isset($user))
                    <h1>{{ $user->full_name }}</h1>
                    @else
                    <h1>{{Lang::get('architect::user.create')}}</h1>
                    @endif
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <label>{{Lang::get('architect::fields.email')}}</label>
                    {!!
                        Form::text(
                            'email',
                            isset($user) ? $user->email : old('email'),
                            [
                                'class' => 'form-control'
                            ]
                        )
                    !!}
                </div>
            </div>

            <div class="row">


                <div class="col-md-6">
                    <label>{{Lang::get('architect::fields.firstname')}}</label>
                    {!!
                        Form::text(
                            'firstname',
                            isset($user) ? $user->firstname : old('firstname'),
                            [
                                'class' => 'form-control'
                            ]
                        )
                    !!}
                </div>

                <div class="col-md-6">
                    <label>{{Lang::get('architect::fields.lastname')}}</label>
                    {!!
                        Form::text(
                            'lastname',
                            isset($user) ? $user->lastname : old('lastname'),
                            [
                                'class' => 'form-control'
                            ]
                        )
                    !!}
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <label>{{Lang::get('architect::fields.password')}}</label>
                    {!!
                        Form::password(
                            'password',
                            [
                                'class' => 'form-control'
                            ]
                        )
                    !!}
                </div>
                <div class="col-md-6">
                    <label>{{Lang::get('architect::fields.co_password')}}</label>
                    {!!
                        Form::password(
                            'password_confirmation',
                            [
                                'class' => 'form-control'
                            ]
                        )
                    !!}
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">

                    @php
                      $languages = [
                                    'ca' => Lang::get('architect::user.catalan'),
                                    'es' => Lang::get('architect::user.spanish'),
                                    'en' => Lang::get('architect::user.english'),
                                    'fr' => Lang::get('architect::user.french')
                                   ];
                     $userLang = isset($user) && $user->language != '' ? $user->language : old('language');

                    @endphp

                    <label>{{Lang::get('architect::fields.language')}}</label>
                    {!!
                        Form::select(
                            'language',
                            $languages,
                            $userLang,
                            [
                                'class' => 'form-control',
                                'placeholder'=> '---'
                            ]
                        )
                    !!}
                </div>
            </div>


            @if(Auth::user()->hasRole(["admin"]))

              <div class="row">
                  <div class="col-md-12">

                      @php
                        $userRole = isset($user) && $user->roles && $user->roles->count() > 0 ? $user->roles->first()->id : old('role');
                      @endphp

                      <label>{{Lang::get('architect::fields.role')}}</label>
                      {!!
                          Form::select(
                              'role_id',
                              App\Models\Role::pluck('display_name', 'id'),
                              $userRole,
                              [
                                  'class' => 'form-control',
                                  'placeholder'=> '---'
                              ]
                          )
                      !!}
                  </div>
              </div>

            @else

              <input type="hidden" name="role_id" value="{{isset($user) && $user->roles && $user->roles->count() > 0 ? $user->roles->first()->id : old('role')}}" />

            @endif


            <div class="row">
                <div class="col-md-12 text-right">
                    {!!
                        Form::submit(Lang::get('architect::fields.save'), [
                            'class' => 'btn btn-primary'
                        ])
                    !!}
                </div>
            </div>




    </div>

      {!! Form::close() !!}

@stop

@push('javascripts-libs')

@endpush
