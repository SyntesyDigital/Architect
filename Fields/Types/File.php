<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;

class File extends Field implements FieldInterface
{
    public $type = 'file';
    public $icon = 'fa-file-pdf-o';
    public $name = 'FILE';

    public $rules = [
        'required'
    ];

    public $settings = [
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
