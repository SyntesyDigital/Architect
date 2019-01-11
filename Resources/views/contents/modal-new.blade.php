
<div class="custom-modal no-buttons" id="new-content-modal">
  <div class="modal-background"></div>


    <div class="modal-container">

      <div class="modal-header">
        <h2></h2>

        <div class="modal-buttons">
          <a class="btn btn-default close-button-modal close-btn" >
            <i class="fa fa-times"></i>
          </a>
        </div>
      </div>

      <div class="modal-content">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2">

              <h3 class="card-title">{{Lang::get('architect::contents.new')}}</h3>
              <h6>{{Lang::get('architect::contents.select_list')}}</h6>


              <div class="grid-items">
                <div class="row">

                    @if(Auth::user()->hasRole(["admin", "editor"]))
                  <div class="col-xs-3">
                    <a href="{{route('contents.page.create')}}">
                      <div class="grid-item">
                        <i class="fa fa-file-o"></i>
                        <p class="grid-item-name">
                          {{Lang::get('architect::fields.page')}}
                        </p>
                      </div>
                    </a>
                  </div>
                    @endif

                    @foreach(Modules\Architect\Entities\Typology::all() as $typology)
                        <div class="col-xs-3">
                          <a href="{{route('contents.create', $typology)}}">
                            <div class="grid-item">
                              <i class="fa {{$typology->icon}}"></i>
                              <p class="grid-item-name">
                                {{$typology->name}}
                              </p>
                            </div>
                          </a>
                        </div>
                    @endforeach
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="modal-footer">
          <a href="" class="btn btn-default close-btn" > {{Lang::get('architect::fields.cancel')}} </a>
        </div>

      </div>
  </div>
</div>
