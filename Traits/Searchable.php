<?php

namespace Modules\Architect\Traits;

use Elasticsearch\ClientBuilder;

use Modules\Architect\Entities\Language;
use Illuminate\Database\Eloquent\Builder;
use Elasticsearch\Common\Exceptions\Missing404Exception;

trait Searchable
{
    public function index()
    {
        if(!config('architect.elasticsearch.enabled')) {
            return null;
        }

        $this->setElasticSearchReadOnlyAllowDelete();

        return $this->getElasticSearchClient()->index([
            'index' => $this->getSearchableIndex(),
            'type' => $this->getSearchableType(),
            'id' => $this->id,
            'body' => $this->toSearchableArray()
        ]);
    }


    public function setElasticSearchReadOnlyAllowDelete()
    {

        if(!$this->getElasticSearchClient()->indices()->exists([
            'index' => $this->getSearchableIndex()
        ])) {
            return false;
        }

        $this->getElasticSearchClient()
            ->indices()
            ->putSettings([
                'index' => $this->getSearchableIndex(),
                'body' => [
                    'index' => [
                        'blocks' => [
                            'read_only_allow_delete' => null
                        ]
                    ]
                ]
            ]);
    }


    public function unindex()
    {
        if(!config('architect.elasticsearch.enabled')) {
            return null;
        }

        $this->setElasticSearchReadOnlyAllowDelete();

        try {
            $this->getElasticSearchClient()->delete([
                'index' => $this->getSearchableIndex(),
                'type' => $this->getSearchableType(),
                'id' => $this->id,
            ]);
        } catch (Missing404Exception $ex) {}
    }


    public static function search(array $parameters)
    {
        if(!config('architect.elasticsearch.enabled')) {
            return null;
        }

        return $this->getElasticSearchClient()->search($parameters);
    }


    public function getSearchableIndex()
    {
        return $this->getSearchableType(); //config('elasticsearch.index');
    }

    public function getSearchableType()
    {
        return $this->typology ? $this->typology->identifier : 'page';
    }


    private function getElasticSearchClient()
    {
        if(!config('architect.elasticsearch.enabled')) {
            return null;
        }

        return ClientBuilder::create()
                ->setHosts(config('elasticsearch.hosts'))
                ->setLogger(ClientBuilder::defaultLogger(storage_path('logs/elastic.log')))
                ->build();
    }

    public function toSearchableArray()
    {
        $searchableArray = [
            //'published_at' => $this->published_at
        ];

        foreach(Language::getAllCached() as $language) {
            $searchableArray[$language->iso] = [];

            if($this->typology) {
                foreach($this->typology->fields as $field) {
                    switch($field->type) {
                        case 'text':
                            $searchableArray[$language->iso][$field->identifier] = $this->getFieldValue($field->identifier, $language->id);
                        break;

                        case 'richtext':
                            $searchableArray[$language->iso][$field->identifier] = strip_tags($this->getFieldValue($field->identifier, $language->id));
                        break;

                        // case 'image':
                        //     $searchableArray[$language->iso]['image'] = $this->getFieldValue($field->identifier, $language->id);
                        // break;
                    }
                }
            }

            if($this->is_page) {
                $searchableArray[$language->iso]['title'] = $this->getTitleAttribute($language);
                $nodes = json_decode($this->page->definition, true);
                $fields = [];
                $this->getPageBody($nodes, $language, $fields);
                $searchableArray[$language->iso]['body'] = sizeof($fields) ? html_entity_decode(strip_tags(implode(',',$fields))) : null;
            }
        }

        return $searchableArray;
    }

    public function getPageBody(&$nodes, $language, &$fields)
    {
        if(!$nodes) {
            return null;
        }

        foreach ($nodes as $key => $node) {
            if(isset($node['children'])) {
                $this->getPageBody($node['children'], $language, $fields);
            } else {
                if(isset($node['field'])) {
                    switch($node['field']["type"]) {
                        case "richtext":
                        case "text":
                            $value = $this->getFieldValue($node['field']['fieldname'], $language->id);

                            if(trim($value)) {
                                $fields[] = $value;
                            }
                        break;


                        case "widget":
                            if(class_exists($node['field']['class'])) {
                                $widget = (new $node['field']['class']);
                                foreach($widget->fields as $_field) {
                                    switch($_field["type"]) {
                                        case "richtext":
                                        case "text":
                                            $identifier = sprintf('%s_%s', $node['field']['fieldname'],  $_field['identifier']);
                                            $value = $this->getFieldValue($identifier, $language->id);

                                            if(trim($value)) {
                                                $fields[] = $value;
                                            }
                                        break;
                                    }
                                }
                            }
                        break;
                    }
                }
            }
        }

        return $fields;
    }


    public function scopeOrderByHits(Builder $query, $hits)
    {
        $case = implode(' ', array_map(function($hit) {
            return 'WHEN id = '.$hit['_id'].' THEN '.$hit['_score'];
        }, $hits));

        return $query->orderByRaw("
            CASE
                {$case}
            END DESC
        ");
    }
}
