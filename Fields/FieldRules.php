<?php

namespace Modules\Architect\Fields;

class FieldRules
{

    public function __construct()
    {
        $this->rules = $this->load();
    }


    public function get()
    {
        return $this->rules;
    }

    public function load()
    {
        $rules = [];
        foreach (glob(__DIR__ . '/Rules/*.php') as $filename){
            $className = sprintf('Modules\Architect\Fields\Rules\%s', str_replace('.php', '', basename($filename)));
            $rule = new $className;

            $rules[$rule->name] = $rule;
        }

        return $rules;
    }
}
?>
