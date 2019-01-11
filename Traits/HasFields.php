<?php

namespace Modules\Architect\Traits;

use Modules\Architect\Entities\Media;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\Language;

use Illuminate\Database\Eloquent\Builder;
use DB;

trait HasFields
{
    public function getFieldChilds($field)
    {
        $arr = [];

        if (!$field) {
            return null;
        }

        foreach ($this->fields as $f) {
            if ($f->parent_id == $field->id) {
                $arr[] = $f;
            }
        }

        return sizeof($arr) ? collect($arr) : null;
    }

    public function fields()
    {
        return $this->hasMany($this->fieldModel);
    }

    public function getField($identifier)
    {
        $attr = $this->fields->where('name', $identifier)->first();

        return $attr ? $attr->value : null;
    }

    public function field($identifier, $languageId = false, $decodeJson = false)
    {
        $field = $this->fields->where('name', $identifier);

        if ($languageId) {
            $field = $field->where('language_id', $languageId);
        }

        return $field->first();
    }


    public function getFieldValue($identifier, $languageId = null)
    {
        /*
        if(!isset($languageId)) {
            $field = $this->fields->where('name', $identifier)->first();
            return isset($field) ? $field->value : null;
        }
        */

        $languageId = isset($languageId) ? $languageId : Language::getCurrentLanguage()->id;

        $field = $this->field($identifier, $languageId);

        return isset($field) ? $field->value : null;
    }

    public static function whereField($name, $value)
    {
        return self::whereHas('fields', function ($q) use ($name, $value) {
            $q->where('name', $name);
            $q->where('value', $value);
        });
    }

    public function getFieldByIdentifier($identifier)
    {
        $field = null;
        foreach ($this->fields as $f) {
            if ($identifier == $f->name) {
                if ($field != null) {
                    if (is_array($field)) {
                        $field[] = $f;
                    } else {
                        $field = [$field, $f];
                    }
                } else {
                    $field = $f;
                }
            }
        }

        return $field;
    }


    public function getFieldValues($identifier, $type, $languages)
    {
        $field = $this->getFieldByIdentifier($identifier);

        if (!$field) {
            return null;
        }

        switch ($type) {
            case 'richtext':
            case 'slug':
            case 'text':
                //$values = [];
                $field = !is_array($field) ? [$field] : $field;
                return collect($field)->mapWithKeys(function ($f) use ($languages) {
                    $iso = null;
                    foreach ($languages as $l) {
                        if ($f->language_id == $l->id) {
                            $iso = $l->iso;
                        }
                    }

                    return [$iso => $f->value];
                })->toArray();

                // return isset($field->value) ? $field->value : null;
            break;

            case 'boolean':
                return $field->value;
            break;

            case 'localization':
                return json_decode($field->value, true);
            break;

            case 'translated_file':
                //$values = [];
                $field = !is_array($field) ? [$field] : $field;
                return collect($field)->mapWithKeys(function ($f) use ($languages) {
                    $iso = null;
                    foreach ($languages as $l) {
                        if ($f->language_id == $l->id) {
                            $iso = $l->iso;
                        }
                    }
                    return [$iso => Media::find($f->value)->toArray()];
                })->toArray();
            break;

            case 'file':
            case 'image':
                return Media::find($field->value)->toArray();
            break;

            case 'images':
                $field = !is_array($field) ? [$field] : $field;
                return Media::whereIn('id', collect($field)->pluck('value'))->get()->toArray();
            break;

            case 'contents':
                $field = !is_array($field) ? [$field] : $field;
                return Content::whereIn('id', collect($field)->pluck('value'))->get()->toArray();
            break;

            case 'date':
                return date('Y-m-d H:i:s', $field->value);
            break;

            case 'url':
            case 'link':
                $values = null;
                $childs = $this->getFieldChilds($field);

                if ($childs != null) {
                    foreach ($childs as $k => $v) {
                        if ($v->language_id) {
                            $iso = null;
                            foreach ($languages as $l) {
                                if ($v->language_id == $l->id) {
                                    $iso = $l->iso;
                                }
                            }
                            $values[ explode('.', $v->name)[1] ][$iso] = $v->value;
                        } else {
                            if (strtolower(explode('.', $v->name)[1]) == 'content') {
                                $values[ explode('.', $v->name)[1] ] = Content::find($v->value);
                            }
                        }
                    }
                }

                return $values;
            break;

            case 'key_values':
                $values = null;
                $childs = $this->getFieldChilds($field);

                if ($childs != null) {
                    foreach ($childs as $k => $v) {
                        $values[explode('.', $v->name)[1]][ explode('.', $v->name)[2] ] = $v->value;
                    }
                }

                return $values;
            break;

            case 'video':
                $values = null;
                $childs = $this->getFieldChilds($field);

                if ($childs != null) {
                    foreach ($childs as $k => $v) {
                        if ($v->language_id) {
                            $iso = null;
                            foreach ($languages as $l) {
                                if ($v->language_id == $l->id) {
                                    $iso = $l->iso;
                                }
                            }

                            $values[ explode('.', $v->name)[1] ][$iso] = $v->value;
                        }
                    }
                }

                return $values;
            break;

            default:
                $field = !is_array($field) ? [$field] : $field;
                return collect($field)->mapWithKeys(function ($f) use ($languages) {
                    $iso = null;
                    foreach ($languages as $l) {
                        if ($f->language_id == $l->id) {
                            $iso = $l->iso;
                        }
                    }

                    return [$iso => $f->value];
                })->toArray();
            break;
        }
    }


    public function scopeByField(Builder $query, $name, $value, $operator = "=", $boolean = 'and')
    {

        if ($boolean == 'or') {
            return $query->orWhereHas('fields', function ($q) use ($name, $value, $operator, $boolean) {
                $q
                    ->where('name', $name)
                    ->where('value', $operator, $value);
            });
        }

        return $query->whereHas('fields', function ($q) use ($name, $value, $operator, $boolean) {
            $q
                ->where('name', $name)
                ->where('value', $operator, $value);
        });
    }

    public function scopeWhereFields(Builder $query, $arr, $boolean = 'and')
    {
        if(!$arr) {
            return $query;
        }

        if (!is_array($arr[0])) {
            if(sizeof($arr) > 2) {
                return $query->byField($arr[0], $arr[2], $arr[1], $boolean);
            } else {
                return $query->byField($arr[0], "=", $arr[1], $boolean);
            }
        }

        $condition = 'and';
        foreach ($arr as $k => $v) {
            if (is_array($v)) {
                if(sizeof($v) > 2) {
                    $query->byField($v[0],$v[2], $v[1], $condition);
                } else {
                    $query->byField($v[0], "=", $v[1], $condition);
                }
                $condition = 'and';
            } else {
                $condition = strtolower($v);
            }
        }

        return $query;
    }

    public function scopeOrderByField(Builder $query, $column, $mode, $iso = null)
    {
        if(in_array($column, $this->fillable) || $column == "id") {
            return $query->orderBy($column, $mode);
        }

        $language = $iso ? Language::byIso($iso)->first() : Language::getDefault();
        $columnName = $column . '_order';

        $sql = DB::raw(sprintf('(
            SELECT
                contents_fields.value
            FROM
                contents_fields
            WHERE
                contents_fields.content_id = contents.id
            AND
                contents_fields.name = "%s"
            AND
                contents_fields.language_id = "%d"
            LIMIT 1
        ) AS %s', $column, $language->id, $columnName));

        return $query
            ->select('*', $sql)
            ->orderBy($columnName, $mode);
    }
}
