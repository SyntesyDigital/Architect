<?php

namespace Modules\Architect\Http\Requests\Language;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLanguageRequest extends FormRequest
{

  public function rules()
  {
      return [
          'name' => 'required',
          'iso' => 'required'
      ];
  }

  public function authorize()
  {
      return true;
  }
}
