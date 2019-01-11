<?php

namespace Modules\Architect\Widgets;

use Modules\Architect\Widget\WidgetInterface;
use Modules\Architect\Entities\ContentField;
use Modules\Architect\Entities\Language;

abstract class Widget
{
    public function model()
    {
        return "Modules\\Architect\\Entities\\ContentField";
    }

    public function __construct()
    {
        if(isset($this->fields)) {
            $fields = [];
            foreach($this->fields as $identifier => $class) {
                $fieldObject = new $class;

                $fields[] = [
                    'class' => $class,
                    'identifier' => $identifier,
                    'type' => $fieldObject->getType(),
                    'name' => trans('architect::fields.' . $identifier),
                ];
            }

            $this->fields = $fields;
        }

    }

    public function getLanguageFromIso($iso, $languages)
    {
        foreach($languages as $language) {
            if($language->iso == $iso) {
                return $language;
            }
        }
        return false;
    }

    public function save($content, $identifier, $fields)
    {
        foreach($fields as $field) {
            $fieldName = $identifier . "_" . $field['identifier'];
            $fieldValue = isset($field['value']) ? $field['value'] : null;
            (new $field['class'])->save($content, $fieldName, $fieldValue);
        }

        return true;
    }

    public function getType()
    {
        return $this->type;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getIcon()
    {
        return $this->icon;
    }

    public function getRules()
    {
        return isset($this->rules) ? $this->rules : null;
    }

    public function getSettings()
    {
        return $this->settings;
    }

    public function getDefaultSettings()
    {
        return isset($this->defaultSettings) ? $this->defaultSettings : null;
    }

    public function getHidden()
    {
      return isset($this->hidden) ? $this->hidden : false;
    }

    public function getFields()
    {
        return isset($this->fields) ? $this->fields : null;
    }

    public function getComponent()
    {
        return isset($this->component) ? $this->component : null;
    }


    public function getWidget()
    {
        return isset($this->widget) ? $this->widget : null;
    }
}
?>
