<?php

namespace Modules\Architect\Tests\Feature;

use Modules\Architect\Tests\TestCase;

use Modules\Architect\Repositories\ContentRepository;

use Modules\Architect\Entities\Content;
use Modules\Architect\Entities\Typology;
use Modules\Architect\Entities\Language;

use App\Models\User;

use Modules\Architect\Jobs\Typology\CreateTypology;
use Modules\Architect\Jobs\Typology\UpdateTypology;

use Modules\Architect\Jobs\Content\CreateContent;
use Modules\Architect\Jobs\Content\UpdateContent;

use Modules\Architect\Jobs\Category\CreateCategory;
use Modules\Architect\Jobs\Category\UpdateCategory;

class TasksUrlsTest extends TestCase
{

    private $attributes = [

        'category' => [
            'parent_id' => null,
            'fields' => [
                'name' => [
                    1 => 'Mi categori', // CA
                    2 => 'Mi Categoria', // ES
                    3 => 'My category' // EN
                ],

                'slug' => [
                    1 => 'mi-categori',
                    2 => 'mi-categoria',
                    3 => 'my-category'
                ],

                'description' => [
                    1 => '',
                    2 => '',
                    3 => ''
                ]
            ]
        ],


        'content' => [
            'status' => 0,
            'typology_id' => null,
            'author_id' => null,
            'is_page' => false,
            'translations' => [
                'es' => true,
                'en' => true,
                'ca' => true,
            ],
            'fields' => [

                [
                    'identifier' => 'title',
                    'type' => 'text',
                    'value' => [
                        'es' => 'Mi articulo (Spanish)',
                        'en' => 'My article (English)',
                        'ca' => 'Mi article (Catala)'
                    ]
                ],

                [
                    'identifier' => 'slug',
                    'type' => 'slug',
                    'value' => [
                        'es' => 'mi-articulo-spanish',
                        'en' => 'my-article-english',
                        'ca' => 'mi-article-catala'
                    ]
                ],


                [
                    'identifier' => 'description',
                    'type' => 'richtext',
                    'value' => [
                        'es' => 'Lorem ipsum...',
                        'en' => 'Lorem ipsum...',
                        'ca' => 'Lorem ipsum...',
                    ]
                ],
            ]
        ],

        'typology' => [
            'name' => 'News',
            'identifier' => 'news',
            'icon' => 'fa-puzzle-piece',
            'has_categories' => false,
            'has_tags' => false,
            'has_slug' => true,
            'slug' => [
                'es' => 'noticias',
                'ca' => 'noticies',
                'en' => 'news'
            ],
            'fields' => [
                [
                    'icon' => 'fa-font',
                    'name' => 'Title',
                    'type' => 'text',
                    'identifier' => 'title',
                    'rules' => '{"required":true,"unique":null,"maxCharacters":null,"minCharacters":null}',
                    'settings' => '{"entryTitle":true,"htmlId":null,"htmlClass":null}',
                ],

                [
                    'icon' => 'fa-link',
                    'name' => 'Slug',
                    'type' => 'slug',
                    'identifier' => 'slug',
                    'rules' => '{"required":true,"unique":true}',
                    'settings' => null,
                ],

                [
                    'icon' => 'fa-align-left',
                    'name' => 'Description',
                    'type' => 'richtext',
                    'identifier' => 'description',
                    'rules' => '{"required":null,"maxCharacters":null}',
                    'settings' => '{"fieldHeight":null,"htmlId":null,"htmlClass":null}',
                ]

            ],
        ]
    ];


    /*
     *  Create Category
     */
     public function createCategory($attributes = null)
     {
         $attributes = $attributes ? $attributes : $this->attributes['category'];

         return (new CreateCategory($attributes))->handle();
     }

    /*
     *  Create Typology
     */
    public function createTypology($attributes = null)
    {
        $attributes = $attributes ? $attributes : $this->attributes['typology'];

        return (new CreateTypology($attributes))->handle();
    }


    /*
     *  Create Content
     */
    public function createContent($attributes = null)
    {
        $attributes = $attributes ? $attributes : $this->attributes['content'];

        $attributes['typology_id'] = !$attributes['is_page'] ? Typology::first()->id : null;
        $attributes['author_id'] = User::first()->id;

        return (new CreateContent($attributes))->handle();
    }

    /*
     *  [TEST] URLs of created content
     */
    public function testCreateContentUrl()
    {
        // 1. Create Typology
        $typology = $this->createTypology();

        // 2. Create Content
        $content = $this->createContent();

        // 3. Testing URLs
        $this->processContentUrlsTest($content);
    }


    /*
     *  [TEST] URLs of updated content
     */
    public function testUpdateContentUrl()
    {
        // 1. Create Typology
        $typology = $this->createTypology();

        // 2. Create Content
        $content = $this->createContent();

        // 3. Update content
        $attributes = $this->attributes["content"];

        $attributes['typology_id'] = Typology::first()->id;
        $attributes['author_id'] = User::first()->id;

        $attributes["fields"][1]["value"] = [
            'es' => 'mi-noticias-spanish-modificada',
            'en' => 'my-news-english-modified',
            'ca' => 'mi-article-catala-modificada'
        ];

        $content = (new UpdateContent($content, $attributes))->handle();

        // 4. Testing URLs
        $this->processContentUrlsTest($content, null, $attributes);
    }

    /*
     *  [TEST] contents URLs when we update a typology
     */
    public function testUpdateTypologyUrl()
    {
        // 1. Create Typology
        $typology = $this->createTypology();

        // 2. Create Content
        $content = $this->createContent();

        // 3. Update typology
        $this->processContentUrlsTest($content);

        $attributes = $this->attributes["typology"];

        $attributes['slug'] = [
            'es' => 'noticias-modificada',
            'ca' => 'noticies-modificada',
            'en' => 'news-modified'
        ];

        $typology = (new UpdateTypology($typology, $attributes))->handle();

        // 4. Testing URLs
        $this->processContentUrlsTest($content->fresh(), $attributes);
    }

    /*
     *  [TEST] URLs where we create a category
     */
    public function testCreateCategoryUrl()
    {
        $category = $this->createCategory();

        foreach($category->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s',
                $language->iso,
                $this->attributes['category']['fields']['slug'][$language->id]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }
    }

    /*
     *  [TEST] URLs where we create a category and add children
     */
    public function testCreateCategoryWithParentUrl()
    {
        // 1. Create first category
        $category = $this->createCategory();

        // 2. Create second category
        $attributes = $this->attributes['category'];

        $attributes['parent_id'] = $category->id;
        $attributes['fields']['name'] = [
            1 => 'Mi categori 2', // CA
            2 => 'Mi Categoria 2', // ES
            3 => 'My category 2' // EN
        ];

        $attributes['fields']['slug'] = [
            1 => 'mi-categori-2',
            2 => 'mi-categoria-2',
            3 => 'my-category-2'
        ];

        $category = $this->createCategory($attributes);

        // 3. Test second category URLS
        foreach($category->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s/%s',
                $language->iso,
                $this->attributes['category']['fields']['slug'][$language->id],
                $attributes['fields']['slug'][$language->id]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }
    }


    /*
     *  [TEST] URLs where we create a category and add children
     */
    public function testCreateCategoryWithParentsUrl()
    {
        // 1. Create first category
        $category = $this->createCategory();

        // 2. Create second category
        $attributes2 = $this->attributes['category'];

        $attributes2['parent_id'] = $category->id;
        $attributes2['fields']['name'] = [
            1 => 'Mi categori 2', // CA
            2 => 'Mi Categoria 2', // ES
            3 => 'My category 2' // EN
        ];

        $attributes2['fields']['slug'] = [
            1 => 'mi-categori-2',
            2 => 'mi-categoria-2',
            3 => 'my-category-2'
        ];

        $category2 = $this->createCategory($attributes2);

        // 2. Create third category
        $attributes3 = $this->attributes['category'];

        $attributes3['parent_id'] = $category2->id;
        $attributes3['fields']['name'] = [
            1 => 'Mi categori 3', // CA
            2 => 'Mi Categoria 3', // ES
            3 => 'My category 3' // EN
        ];

        $attributes3['fields']['slug'] = [
            1 => 'mi-categori-3',
            2 => 'mi-categoria-3',
            3 => 'my-category-3'
        ];

        $category3 = $this->createCategory($attributes3);

        // 3. Test third category URLS
        foreach($category3->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s/%s/%s',
                $language->iso,
                $this->attributes['category']['fields']['slug'][$language->id],
                $attributes2['fields']['slug'][$language->id],
                $attributes3['fields']['slug'][$language->id]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }


        // 4. Test second category URLS
        foreach($category2->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s/%s',
                $language->iso,
                $this->attributes['category']['fields']['slug'][$language->id],
                $attributes2['fields']['slug'][$language->id]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }
    }


    /*
     *  [TEST] URLs where we update a category with children
     */
    public function testUpdateCategoryWithParentsUrl()
    {
        // 1. Create first category
        $category = $this->createCategory();

        // 2. Create second category
        $attributes2 = $this->attributes['category'];

        $attributes2['parent_id'] = $category->id;
        $attributes2['fields']['name'] = [
            1 => 'Mi categori 2', // CA
            2 => 'Mi Categoria 2', // ES
            3 => 'My category 2' // EN
        ];

        $attributes2['fields']['slug'] = [
            1 => 'mi-categori-2',
            2 => 'mi-categoria-2',
            3 => 'my-category-2'
        ];

        $category2 = $this->createCategory($attributes2);

        // 2. Create third category
        $attributes3 = $this->attributes['category'];

        $attributes3['parent_id'] = $category2->id;
        $attributes3['fields']['name'] = [
            1 => 'Mi categori 3', // CA
            2 => 'Mi Categoria 3', // ES
            3 => 'My category 3' // EN
        ];

        $attributes3['fields']['slug'] = [
            1 => 'mi-categori-3',
            2 => 'mi-categoria-3',
            3 => 'my-category-3'
        ];

        $category3 = $this->createCategory($attributes3);


        // 3. Update Category 2
        $attributes2['fields']['slug'] = [
            1 => 'mi-categori-2-modified',
            2 => 'mi-categoria-2-modified',
            3 => 'my-category-2-modified'
        ];
        $category2 = (new UpdateCategory($category2, $attributes2))->handle();


        // 4. Test Category 2 URLS
        foreach($category2->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s/%s',
                $language->iso,
                $this->attributes['category']['fields']['slug'][$language->id],
                $attributes2['fields']['slug'][$language->id]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }


        // 5. Update Category 3
        $attributes3['fields']['slug'] = [
            1 => 'mi-categori-3-modified',
            2 => 'mi-categoria-3-modified',
            3 => 'my-category-3-modified'
        ];
        $category3 = (new UpdateCategory($category3, $attributes3))->handle();

        // 5. Test Category 3 URLS
        foreach($category3->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s/%s/%s',
                $language->iso,
                $this->attributes['category']['fields']['slug'][$language->id],
                $attributes2['fields']['slug'][$language->id],
                $attributes3['fields']['slug'][$language->id]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }
    }


    /*
     *  [TEST] URLs where we create a page and add children
     */
    public function testCreatePageWithParentsUrl()
    {
        // 1. Create Page 1
        $attributes1 = $this->attributes['content'];
        $attributes1['is_page'] = true;
        $attributes1['definition'] = [];
        $attributes1["fields"][1]["value"] = [
            'es' => 'mi-pagina-1',
            'en' => 'my-page-1',
            'ca' => 'mi-pagine-1'
        ];

        $page1 = $this->createContent($attributes1);

        // 2. Test Page 1 URLS
        foreach($page1->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s',
                $language->iso,
                $attributes1['fields'][1]['value'][$language->iso]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }

        // 3. Create Page 2
        $attributes2 = $this->attributes['content'];
        $attributes2['is_page'] = true;
        $attributes2['definition'] = [];
        $attributes2['parent_id'] = $page1->id;
        $attributes2["fields"][1]["value"] = [
            'es' => 'mi-pagina-2',
            'en' => 'my-page-2',
            'ca' => 'mi-pagine-2'
        ];

        $page2 = $this->createContent($attributes2);


        // 4. Test Page 2 URLS
        foreach($page2->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s/%s',
                $language->iso,
                $attributes1['fields'][1]['value'][$language->iso],
                $attributes2['fields'][1]['value'][$language->iso]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }
    }

    /*
     *  [TEST] URLs where we update a page and add children
     */
    public function testUpdatePageWithParentsUrl()
    {
        // 1. Create Page 1
        $attributes1 = $this->attributes['content'];
        $attributes1['is_page'] = true;
        $attributes1['definition'] = [];
        $attributes1["fields"][1]["value"] = [
            'es' => 'mi-pagina-1',
            'en' => 'my-page-1',
            'ca' => 'mi-pagine-1'
        ];
        $page1 = $this->createContent($attributes1);


        // 2. Create Page 2
        $attributes2 = $this->attributes['content'];
        $attributes2['is_page'] = true;
        $attributes2['definition'] = [];
        $attributes2['parent_id'] = $page1->id;
        $attributes2["fields"][1]["value"] = [
            'es' => 'mi-pagina-2',
            'en' => 'my-page-2',
            'ca' => 'mi-pagine-2'
        ];
        $page2 = $this->createContent($attributes2);


        // 3. Update Page 1
        $attributes1['author_id'] = User::first()->id;
        $attributes1["fields"][1]["value"] = [
            'es' => 'mi-pagina-1-modificada',
            'en' => 'my-page-1-modified',
            'ca' => 'mi-pagine-1-modificada'
        ];
        $page1 = (new UpdateContent($page1, $attributes1))->handle();


        // 4. Test Page 1 URLS
        foreach($page1->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s',
                $language->iso,
                $attributes1['fields'][1]['value'][$language->iso]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }


        // 5. Test children Page 2 URLS
        $page2 = Content::find($page2->id);
        foreach($page2->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s/%s',
                $language->iso,
                $attributes1['fields'][1]['value'][$language->iso],
                $attributes2['fields'][1]['value'][$language->iso]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }
    }


    /*
     *  Process assert of content Urls
     */
    private function processContentUrlsTest($content, $typologyAttributes = null, $contentAttributes = null)
    {
        $typologyAttributes = $typologyAttributes ?: $this->attributes['typology'];
        $contentAttributes = $contentAttributes ?: $this->attributes['content'];

        foreach($content->urls as $url) {
            $language = Language::find($url->language_id);

            $actual = $url->url;

            $excepted = sprintf('/%s/%s/%s',
                $language->iso,
                $typologyAttributes['slug'][$language->iso],
                $contentAttributes['fields'][1]['value'][$language->iso]
            );

            $message = '--> BAD URL  : ' . $actual . ' must be ' . $excepted;

            $this->assertSame($excepted, $actual, $message);
        }
    }
}
