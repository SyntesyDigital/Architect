<?php

namespace Modules\Architect\Repositories\Criterias;

use Prettus\Repository\Contracts\RepositoryInterface;
use Prettus\Repository\Contracts\CriteriaInterface;

class MediaModalDatatableCriteria implements CriteriaInterface
{

    public function apply($model, RepositoryInterface $repository)
    {
        return $model
            ->leftJoin('users', 'users.id', '=', 'medias.author_id')
            ->select(
                'medias.*',
                'users.firstname',
                'users.lastname'
            )
            ->type(request('type'))
            ->orderBy('created_at', 'desc');
    }
}
