<?php

namespace Modules\Architect\Tasks\Urls;

use Modules\Architect\Entities\Category;
use Modules\Architect\Entities\Language;
use Modules\Architect\Entities\Url;

use Modules\Architect\Tasks\Urls\UpdateUrlsContent;
use Modules\Architect\Tasks\Urls\CreateUrlsCategory;

class UpdateUrlsCategory
{
    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function run()
    {
        // Update Category url
        $this->category->urls()->delete();

        (new CreateUrlsCategory($this->category))->run();

        // Update Category childrens urls & childrens contents Urls
        $languages = Language::getAllCached();

        $traverse = function ($categories) use (&$traverse, $languages) {
            foreach ($categories as $category) {
                (new UpdateUrlsCategory($category))->run();

                if($category->children) {
                    $traverse($category->children);
                }
            }
        };

        // Update contents URLS
        // $this->category->contents->map(function($content){
        //     (new UpdateUrlsContent($content))->run();
        // });

        if($this->category->children) {
            $traverse($this->category->children);
        }

        // Update Typology
    }

}
