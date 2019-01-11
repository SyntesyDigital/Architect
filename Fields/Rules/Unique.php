<?php

namespace Modules\Architect\Fields\Rules;


use Modules\Architect\Entities\Content;

class Unique
{
    public $name = "unique";

    public function validate($value, $param, $identifier)
    {
        $values = !is_array($value) ? [$value] : $value;
        $errors = [];

        if($param) {
            foreach($values as $k => $value) {
                $isUpdate = request('content_id') ? true : false;
                if($isUpdate) {
                    if(Content::whereField($identifier, $value)->where('id', '<>', request('content_id'))->count() > 0) {
                        $errors[$k] = $this->message();
                    }
                } else {
                    if(Content::whereField($identifier, $value)->count() > 0) {
                        $errors[$k] = $this->message();
                    }
                }
            }
        }

        return !empty($errors) ? $errors : null;
    }

    public function message()
    {
        return trans('architect::rules.unique');
    }
}
