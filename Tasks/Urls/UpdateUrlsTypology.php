<?php

namespace Modules\Architect\Tasks\Urls;

use Modules\Architect\Entities\Typology;
use Modules\Architect\Entities\Language;
use Modules\Architect\Entities\Url;

use Modules\Architect\Tasks\Urls\UpdateUrlsContent;

class UpdateUrlsTypology
{
    public function __construct(Typology $typology)
    {
        $this->typology = $typology;
    }

    public function run()
    {
        // If typology no has slug then we don't need to build URLs
        if(!$this->typology->has_slug) {
            return false;
        }

        // Delete URLs of the typology
        $this->typology->urls()->delete();

        // Build URLs of the typology
        Language::getAllCached()->map(function($language) {

            $attr = $this->typology->attrs->where('name', 'slug')
                ->where('language_id', $language->id)
                ->first();

            if(isset($attr->value)) {
                $this->typology->urls()->create([
                    'language_id' => $language->id,
                    'url' => sprintf('/%s/%s',
                        $language->iso,
                        $attr->value
                    )
                ]);
            }
        });

        // Refresh typology attributes
        $this->typology->load('attrs', 'fields');

        // Update all contents urls
        $this->typology->contents->map(function($content) {
            (new UpdateUrlsContent($content))->run();
        });
    }

}
