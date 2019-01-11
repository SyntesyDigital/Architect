<?php

namespace Modules\Architect\Tasks\Urls;

use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\Category;
use Modules\Architect\Entities\Language;
use Modules\Architect\Entities\Url;

class CreateUrlsContent
{
    public function __construct(Content $content)
    {
        $this->content = $content;
    }

    public function run()
    {
        return $this->content->is_page ? $this->createPageUrl() : $this->createContentUrl();
    }

    private function createPageUrl()
    {
        $content = $this->content;

        Language::getAllCached()->map(function($language) use ($content) {
            $url = $content->getFullSlug($language->id);

            if($url) {
                $content->urls()->create([
                    'language_id' => $language->id,
                    'url' => '/' . $language->iso . "/" . $url
                ]);
            }
        });

        return true;
    }

    /*
     *  Build content url and save it
     *
     *  URLs schema :
     *      - Content with typology : /{typology_slug}/{content_slug}
     *      - Content with typology & category : /{typology_slug}/{category_slug}/../{content_slug}
     */
    private function createContentUrl()
    {
        if(!$this->content->typology->has_slug) {
            return false;
        }

        foreach(Language::getAllCached() as $language) {
            $this->content->urls()->create([
                'language_id' => $language->id,
                'url' => sprintf(
                    '/%s/%s/%s',
                    $language->iso,
                    $this->content->typology->getSlug($language->id),
                    $this->content->getFieldValue('slug', $language->id)
                ),
            ]);
        }

        // Save category slug by languages
        // if($this->content->typology->has_categories) {
        //     foreach($urls as $languageId => $url) {
        //         $category = $this->content->categories->first();
        //         if($category) {
        //             $urls[$languageId] .= $category->getFullSlug($languageId);
        //         }
        //     }
        // }

        return true;
    }
}
