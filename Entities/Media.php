<?php

namespace Modules\Architect\Entities;

use Illuminate\Database\Eloquent\Model;
use Storage;

use Illuminate\Database\Eloquent\Builder;

class Media extends Model
{
    protected $casts = [
        'metadata' => 'array'
    ];

    protected $appends = ['urls'];

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'medias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
         'type',
         'mime_type',
         'stored_filename',
         'uploaded_filename',
         'metadata',
         'author_id'
     ];

    /**
     * The attributes that are hidden from serialization.
     *
     * @var array
     */
    protected $hidden = [];

    public function author()
    {
        return $this->hasOne('App\Models\User', 'id', 'author_id');
    }

    public function getMetaJSON()
    {
        return json_encode($this->metadata);
    }


    public function getUrlsAttribute()
    {

        $config = config('images');

        if(strpos($this->type, 'application') !== false ){
          $urls = [
              'files' => sprintf('%s/files/%s',
                  str_replace('public', 'storage', $config['storage_directory']),
                  $this->stored_filename
              )
          ];
          return $urls;
        }
        else {

          $urls = [
              'original' => sprintf('%s/original/%s',
                  str_replace('public', 'storage', $config['storage_directory']),
                  $this->stored_filename
              )
          ];

          foreach($config["formats"] as $format) {
              $path = sprintf('%s/%s/%s',
                  str_replace('public', 'storage', $config['storage_directory']),
                  $format['directory'],
                  $this->stored_filename
              );

              if(stream_resolve_include_path($path)) {
                  $urls[ $format['name'] ] = $path;
              }
          }

          return $urls;

        }
    }

    public function scopeNotType(Builder $builder, $type = null)
    {
        return $type ? $builder->whereNot('type', 'LIKE', str_replace('*', '%', $type)) : $builder;
    }

    public function scopeType(Builder $builder, $type = null)
    {
        return $type ? $builder->where('type', 'LIKE', str_replace('*', '%', $type)) : $builder;
    }

}
