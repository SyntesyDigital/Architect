<?php

namespace Modules\Architect\Fields\Rules;

use Modules\Architect\Entities\Language;

class Required
{
    public $name = "required";

    public function validate($value, $param, $identifier)
    {
        $values = !is_array($value) ? [$value] : $value;
        $errors = [];

        if($param) {
            if(empty($values)) {
                $errors[] = $this->message();
            }

            $language = Language::getDefault();
            $translations = request('translations');

            if((!isset($values[$language->iso])) || trim($values[$language->iso]) == ""){
              $errors[$language->iso] = $this->message();
            }

            if($translations) {
              foreach($translations as $iso => $bool){
                if($bool){
                  if((!isset($values[$iso])) || trim($values[$iso]) == ""){
                    $errors[$iso] = $this->message();
                  }
                }
              }
            }

            /*
            foreach($values as $k => $value) {
                if(!trim($value)) {
                    $errors[$k] = $this->message();
                }
            }
            */
        }

        return !empty($errors) ? $errors : null;
    }

    public function message()
    {
        return trans('architect::rules.required');
    }
}
