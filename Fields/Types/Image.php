<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;

class Image extends Field implements FieldInterface
{
    public $type = 'image';
    public $icon = 'fa-picture-o';
    public $name = 'IMAGE';

    public $rules = [
        'required'
    ];

    public $settings = [
        'cropsAllowed',
        'htmlId',
        'htmlClass'
    ];

    public function save($content, $identifier, $media, $languages = null)
    {
        $mediaId = isset($media['id']) ? $media['id'] : null;

        if($mediaId) {
            return $content->fields()->save(new ContentField([
                'name' => $identifier,
                'value' => $mediaId,
                'relation' => 'medias'
            ]));
        }

        return false;
    }

}
?>
