<?php

namespace Modules\Architect\Fields;

class FieldConfig
{

    public function __construct()
    {
        $this->fields = self::get();
    }

    public function getByType($type)
    {
        if(is_array($this->fields)) {
            foreach($this->fields as $k => $field) {
                if($field["type"] == $type) {
                    return $field;
                }
            }
        }

        return null;
    }

    // FIXME : find a better way ! -)
    public static function get()
    {
        $fields = [];
        foreach (glob(__DIR__ . '/Types/*.php') as $filename){
            $className = sprintf('Modules\Architect\Fields\Types\%s', str_replace('.php', '', basename($filename)));
            $field = new $className;

            $fields[$field->name] = [
                'class' => $className,
                'rules' => $field->getRules(),
                'label' => $field->getName(),
                'name' => trans('architect::fields.' . $field->getType()),
                'type' => $field->getType(),
                'icon' => $field->getIcon(),
                'settings' => $field->getSettings() ?: null
            ];
        }

        return $fields;
    }
}
?>
