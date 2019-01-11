<?php

namespace Modules\Architect\Jobs\Typology;

use Modules\Architect\Http\Requests\Typology\DeleteTypologyRequest;
use Modules\Architect\Entities\Typology;

class DeleteTypology
{
    public function __construct(Typology $typology)
    {
        $this->typology = $typology;
    }

    public static function fromRequest(Typology $typology, DeleteTypologyRequest $request)
    {
        return new self($typology);
    }

    public function handle()
    {
        return $this->typology->delete();
    }
}
