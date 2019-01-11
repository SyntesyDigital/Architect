<script>
  const WEBROOT = '/';
  const ASSETS = '{{ asset('') }}';
  const IMAGES_FORMATS = {!! json_encode(config('images.formats'), JSON_PRETTY_PRINT) !!};
  const FIELDS = {!! json_encode(Modules\Architect\Fields\FieldConfig::get(), JSON_PRETTY_PRINT) !!};
  const WIDGETS = {!! json_encode(Modules\Architect\Widgets\WidgetConfig::get(), JSON_PRETTY_PRINT) !!};
  const CURRENT_USER = {!! Auth::user() ? json_encode(Auth::user()->load('roles'), JSON_PRETTY_PRINT) : null !!};
  const LANGUAGES = {!! json_encode(Modules\Architect\Entities\Language::orderBy('name', 'DESC')->get(), JSON_PRETTY_PRINT) !!};
  const TYPOLOGIES = {!! json_encode(Modules\Architect\Entities\Typology::all(), JSON_PRETTY_PRINT) !!};
  const ROW_SETTINGS = ['htmlId','htmlClass','hasContainer'];
  const COL_SETTINGS = ['htmlId','htmlClass'];
  const PAGE_SETTINGS = ['htmlClass','pageType'];
  const CONTENT_SETTINGS = ['htmlClass'];
  const CATEGORIES = {!! json_encode(Modules\Architect\Entities\Category::all(), JSON_PRETTY_PRINT) !!};
  const DEFAULT_LOCALE = '{{ Modules\Architect\Entities\Language::getDefault()->iso}}';
</script>
