<div class="sidebar">
  <ul>
    <li class="{{ isset($display_pages) ? 'active' : '' }}">
      <a href="{{route('contents')}}?display_pages=true" > <i class="fa fa-file-o"></i> <span class="text">{{Lang::get('architect::fields.pages')}}</span> </a>
    </li>
  </ul>
  <hr />
  <ul>
    @foreach($typologies as $typology)
        @if(isset($typology_id) && $typology_id == $typology->id)
          <li class="active">
        @else
          <li>
        @endif

          <a href="{{route('contents', ['typology_id' => $typology->id])}}"><i class="fa {{$typology->icon}}"></i><span class="text">{{$typology->name}}</span> </a>
        </li>
    @endforeach()
  </ul>
  <hr/>
  <ul>
    <li class="{{ Request::is('architect/categories*') ? 'active' : '' }}">
      <a href="{{route('categories')}}"> <i class="fa fa-list"></i> <span class="text">{{Lang::get('architect::category.categories')}}</span> </a>
    </li>

    <li class="{{ Request::is('architect/tags*') ? 'active' : '' }}">
      <a href="{{route('tags')}}"> <i class="fa fa-tag"></i> <span class="text">{{Lang::get('architect::fields.tags')}}</span> </a>
    </li>
  </ul>
</div>
