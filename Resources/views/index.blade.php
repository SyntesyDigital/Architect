@extends('architect::layouts.master')

@section('content')
<div class="container dashboard">
  <div class="row">
    <div class="col-md-offset-2 col-md-8">

      <div class="page-title">
        <h1>{{Lang::get('architect::home.wellcome')}} {{Auth::user()->firstname}},</h1>
        <h3>{{Lang::get('architect::home.current_state')}}</h3>
      </div>

      <div class="dashboard-items">
        <div class="row">

            @if(Auth::user()->hasRole(["admin","recruiter"]))

              @include('architect::partials.dashboard-counter',[
                "name" => "Offres",
                "value" => Modules\RRHH\Entities\Offers\Offer::all()->count(),
                "icon" => "fa-file-o",
                "route" => route('rrhh.admin.offers.index')
              ])

              @include('architect::partials.dashboard-counter',[
                "name" => 'Candidatures',
                "value" => Modules\RRHH\Entities\Offers\Application::all()->count(),
                "icon" => "fa-address-card",
                "route" => route('rrhh.admin.applications.index')
              ])

              @include('architect::partials.dashboard-counter',[
                "name" => 'Candidats',
                "value" => Modules\RRHH\Entities\Offers\Candidate::all()->count(),
                "icon" => "fa-user",
                "route" => route('rrhh.admin.candidates.index')
              ])

              @include('architect::partials.dashboard-counter',[
                "name" => "Clients",
                "value" => Modules\RRHH\Entities\Customer::all()->count(),
                "icon" => "fa-user-o",
                "route" => route('rrhh.admin.customers.index')
              ])

            @endif

            @if(Auth::user()->hasRole(["admin"]))
              <div class="col-xs-6">
                <!-- React Table.js -->
                <div id="dashboard-table"
                  title={{Lang::get('architect::home.pages')}}
                  route={{route('contents.modal.data')."?is_page=1"}}
                ></div>
              </div>

              <div class="col-xs-6">
                <!-- React Table.js -->
                <div id="dashboard-table"
                  title={{Lang::get('architect::home.news')}}
                  route={{route('contents.modal.data')."?typology_id=1"}}
                ></div>
              </div>


              <div class="col-xs-12">
                <!-- React SiteMap.js-->
                <div id="dashboard-sitemap"></div>
              </div>
            @endif

        </div>
      </div>

    </div>
  </div>

  <div class="separator" style="height:60px;"></div>

</div>

@stop

@push('javascripts-libs')
{{ Html::script('/modules/architect/js/libs/d3/d3.v4.min.js') }}
<script>
var routes = {
  'showContent' : "{{route('contents.show',['id' => ':id'])}}",
};
</script>
@endpush
