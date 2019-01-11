<?php

namespace Modules\Architect\Console;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class ElasticSearchRemoveAllIndexes extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'architect:elasticsearch-remove-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove all indexes.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        echo exec('curl -XDELETE localhost:9200/*');
    }
}
