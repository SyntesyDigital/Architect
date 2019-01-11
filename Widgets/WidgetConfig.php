<?php

namespace Modules\Architect\Widgets;

class WidgetConfig
{
    public function __construct()
    {
        $this->widgets = self::get();
    }

    // FIXME : find a better way ! -)
    public static function get()
    {
        $widgets = [];
        foreach (glob(__DIR__ . '/Types/*.php') as $filename){
            $className = sprintf('Modules\Architect\Widgets\Types\%s', str_replace('.php', '', basename($filename)));
            $widget = new $className;

            $widgets[$widget->name] = [
                'class' => $className,
                'rules' => $widget->getRules(),
                'label' => $widget->getName(),
                'name' => trans('architect::widgets.' . $widget->getName()),
                'type' => $widget->getType(),
                'icon' => $widget->getIcon(),
                'settings' => $widget->getSettings() ?: null,
                'fields' => $widget->getFields(),
                'component' => $widget->getComponent(),
                'widget' => $widget->getWidget(),
                'hidden' => $widget->getHidden(),
                'defaultSettings' => $widget->getDefaultSettings()
            ];
        }

        return $widgets;
    }
}
?>
