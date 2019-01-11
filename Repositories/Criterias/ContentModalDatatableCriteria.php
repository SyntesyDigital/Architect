<?php

namespace Modules\Architect\Repositories\Criterias;

use Prettus\Repository\Contracts\RepositoryInterface;
use Prettus\Repository\Contracts\CriteriaInterface;

class ContentModalDatatableCriteria implements CriteriaInterface
{

    public function apply($model, RepositoryInterface $repository)
    {
        $acceptLang = request('accept_lang');
        $typologyId = request('typology_id') ? json_decode(request('typology_id'), true) : null;
        $categoryId = request('category_id') ? json_decode(request('category_id'), true) : null;
        $tags = request('tags') ? json_decode(request('tags'), true) : null;
        $fields = request('fields') ? json_decode(request('fields')) : null;
        $hasSlug = request('has_slug');
        $isPage = request('is_page');

        $query = $model
            ->languageIso($acceptLang)
            ->categoryId($categoryId)
            ->byTagsIds($tags)
            ->whereFields($fields)
            ->where(function ($query) use ($hasSlug, $isPage, $typologyId) {
                if($isPage) {
                    $query->orWhere('is_page', 1);
                }

                if($typologyId) {
                    $typologyId = is_array($typologyId) ? $typologyId : [$typologyId];
                    $query->orWhereIn('typology_id', $typologyId);
                }

                if($hasSlug) {
                    $query->orWhereHas('typology', function($query){
                        $query->where('has_slug', true);
                    });
                }
            })->with(
                'author',
                'typology',
                'urls',
                'page',
                'fields',
                'parent'
            );

        return $query;
    }
}
