<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Builder;
use Cache;
use App;

class Language extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'languages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'iso',
        'default'
    ];

    /**
     * The attributes that are hidden from serialization.
     *
     * @var array
     */
    protected $hidden = [
        'deleted_at'
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function typology()
    {
        return $this->hasOne('\Modules\Architect\Entities\Typology', "id", "typology_id");
    }


    public static function getDefault()
    {
        $key = 'languages.default';
        $language = cache($key);

        if(!isset($language)) {
            $language = self::where('default', 1)->first();

            if(!isset($language)){
              $language = self::first();
            }

            cache([
                $key => $language
            ], now()->addSeconds(5 * 60));
        }

        return $language;
    }


    public function save(array $options = [])
    {
        // Remove caches
        Cache::forget('languages.default');
        Cache::forget('languages.all');

        parent::save($options);
    }

    public static function getCurrentLanguage()
    {
        $currentLang = self::getAllCached()->where('iso', App::getLocale())->first();
        return $currentLang ? $currentLang : self::getDefault();
    }


    public static function getCachedLanguageById($languageId)
    {
        return self::getAllCached()->where('id', $languageId)->first();
    }

    public static function getAllCached()
    {
        $key = "languages.all";
        $languages = cache($key);

        if(!isset($languages)) {
            $languages = self::all();

            cache([
                $key => $languages
            ], now()->addSeconds(5 * 60));
        }
        return $languages;
    }

    public static function getByIso()
    {
        $key = 'languages.byIso';
        $languages = cache($key);

        if(!isset($languages)) {
            $languages = self::pluck('iso','id');

            cache([
                $key => $languages
            ], now()->addSeconds(5 * 60));
        }

        return $languages;
    }

    /*
     *  Scopes
     */
    public function scopeByIso(Builder $query, $iso)
    {
        return $query->where('iso', $iso);
    }

}
