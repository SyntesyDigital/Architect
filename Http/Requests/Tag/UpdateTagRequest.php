<?php

namespace Modules\Architect\Http\Requests\Tag;

use Illuminate\Foundation\Http\FormRequest;

use Modules\Architect\Entities\Tag;
use Modules\Architect\Entities\Language;

class UpdateTagRequest extends FormRequest
{

    public function rules()
    {
        $this->fieldName = 'fields';

        return $this->buildRules();
    }

    private function buildRules()
    {
        $rules = [];
        $languages = Language::getAllCached();

        // print_r(request()->all());
        // exit();

        foreach(Tag::FIELDS as $field) {
            foreach($languages as $language) {
                $required = isset($field['required']) ? $field['required'] : false;

                if($required) {
                    $fieldPath = $this->fieldName . '.' . $field['identifier'] . '.' . $language->id;
                    $rules[$fieldPath] = 'required';
                }
            }

        }

        return $rules;
    }

    public function messages()
    {
        $messages = [];
        $languages = Language::getAllCached();

        foreach(Tag::FIELDS as $field) {
            foreach($languages as $language) {
                $required = isset($field['required']) ? $field['required'] : false;

                if($required) {
                    $fieldPath = $this->fieldName . '.' . $field['identifier'] . '.' . $language->id;
                    $messages[$fieldPath . '.required'] = trans('validation.required', [
                        'attribute' => $field['name'] . ' - ' . $language->name
                    ]);
                }
            }
        }

        return $messages;
    }

    public function authorize()
    {
        return true;
    }
}
