<?php

namespace Modules\Architect\Fields\Types;

use Modules\Architect\Fields\Field;
use Modules\Architect\Fields\FieldInterface;
use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\ContentField;
use Modules\Architect\Entities\Language;

class TranslatedFile extends Field implements FieldInterface
{
    public $type = 'translated_file';
    public $icon = 'fa-file-pdf-o';
    public $name = 'TRANSLATED_FILE';

    public $rules = [
        'required'
    ];

    public $settings = [
        'htmlId',
        'htmlClass'
    ];

    public function save($content, $identifier, $values, $languages = null)
    {

        $languages = Language::getAllCached();
        $values = !is_array($values) ? [$values] : $values;

        foreach($values as $iso => $value) {

            $language = $this->getLanguageFromIso($iso, $languages);

            $mediaId = isset($value['id']) ? $value['id'] : null;
            if($mediaId) {
                $content->fields()->save(new ContentField([
                    'name' => $identifier,
                    'value' => $mediaId,
                    'relation' => 'medias',
                    'language_id' => $language ? $language->id : null
                ]));
            }

        }

        return true;

    }

}
?>
