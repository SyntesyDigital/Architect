@extends('architect::layouts.master')

@section('content')
  <div class="container grid-page">
    <div class="row">
      <div class="col-md-offset-2 col-md-8">

        <div class="page-title">
          <h1>{{Lang::get('architect::tipology.tipologies')}}</h1> <a href="{{route('typologies.create')}}" class="btn btn-primary"><i class="fa fa-plus-circle"></i> &nbsp; {{Lang::get('architect::tipology.add')}}</a>
        </div>

        <div class="grid-items">
          <div class="row">
              @foreach($typologies as $typology)
                <div class="col-xs-3">
                    <a href="{{ route('typologies.show', $typology) }}">
                      <div class="grid-item">
                          <i class="fa {{$typology->icon}}"></i>
                          <p class="grid-item-name">
                              {{$typology->name}}
                          </p>
                      </div>
                    </a>
                </div>
              @endforeach()
          </div>
        </div>

      </div>
    </div>
  </div>

@stop
