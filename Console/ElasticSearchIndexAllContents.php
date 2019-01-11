<?php

namespace Modules\Architect\Console;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

use Modules\Architect\Entities\Content;

class ElasticSearchIndexAllContents extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'architect:elasticsearch-index-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Index all contents into elastic search.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $contents = Content::all();
        $bar = $this->output->createProgressBar(count($contents->toArray()));
        $self = $this;

        $contents->map(function($content) use ($self, $bar) {
            $content->index();

            $self->info(' -> Indexing content [' . $content->id . '] (' . $content->getSearchableType() . ') : ' . $content->getTitleAttribute());

            $bar->advance();
        });

        $bar->finish();
        echo PHP_EOL;
    }


}
