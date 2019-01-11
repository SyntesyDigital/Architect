@extends('architect::layouts.master')

@section('content')
<div class="container grid-page">
  <div class="row">
    <div class="col-md-offset-2 col-md-8">

      <div class="page-title">
        <h1>{{Lang::get('architect::settings.title')}}</h1>
        <h3>{{Lang::get('architect::settings.subtitle')}}</h3>
      </div>

      <div class="grid-items">
        <div class="row">
            @foreach(config('settings') as $setting)

              @if(empty($item['roles']) || Auth::user()->hasRole([$item['roles']]))
                <div class="col-xs-3">
                    <a href="{{ route($setting["route"]) }}">
                      <div class="grid-item">
                          <i class="fa {{ $setting["icon"] }}"></i>
                          <p class="grid-item-name">
                              {{ $setting["label"] }}
                          </p>
                      </div>
                    </a>
                </div>
              @endif
            @endforeach()

            {{-- Plugins settings --}}
            @foreach(config('architect::plugins.settings') as $setting)
                @if(empty($item['roles']) || Auth::user()->hasRole([$item['roles']]))
                  <div class="col-xs-3">
                      <a href="{{ route($setting["route"]) }}">
                        <div class="grid-item">
                            <i class="fa {{ $setting["icon"] }}"></i>
                            <p class="grid-item-name">
                                {{ $setting["label"] }}
                            </p>
                        </div>
                      </a>
                  </div>
                @endif
            @endforeach()

        </div>
      </div>

    </div>
  </div>
</div>


@stop
