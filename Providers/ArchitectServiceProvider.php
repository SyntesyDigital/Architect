<?php

namespace Modules\Architect\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Factory;
use Illuminate\Routing\Router;

class ArchitectServiceProvider extends ServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     * Boot the application events.
     *
     * @return void
     */
    public function boot(Router $router)
    {
        $this->registerTranslations();
        $this->registerConfig();
        $this->registerViews();
        $this->registerFactories();
        $this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');
        $router->aliasMiddleware('DetectUserLocale', \Modules\Architect\Http\Middleware\DetectUserLocale::class);
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        //
        $this->commands([
            \Modules\Architect\Console\ElasticSearchIndexAllContents::class,
            \Modules\Architect\Console\ElasticSearchBuildsIndexes::class,
            \Modules\Architect\Console\ElasticSearchRemoveAllIndexes::class,
            \Modules\Architect\Console\BuildAllUrls::class,
        ]);
    }

    /**
     * Register config.
     *
     * @return void
     */
    protected function registerConfig()
    {
        $this->publishes([
            __DIR__.'/../Config/config.php' => config_path('architect.php'),
        ], 'config');

        // Merging configuration
        $this->mergeConfigFrom(__DIR__.'/../Config/config.php', 'architect');
        $this->mergeConfigFrom(__DIR__.'/../Config/elasticsearch.php', 'architect.elasticsearch');
        $this->mergeConfigFrom(__DIR__.'/../Config/images.php', 'images');
        $this->mergeConfigFrom(__DIR__.'/../Config/database.php', 'database.connections');
        $this->mergeConfigFrom(__DIR__.'/../Config/settings.php', 'settings');

        // We really use-it ?
        $this->mergeConfigFrom(__DIR__.'/../Config/medias.php', 'medias');
        $this->mergeConfigFrom(__DIR__.'/../Config/fields.php', 'fields');

        $this->mergeConfigFrom(__DIR__.'/../Config/menu.php', 'architect::menu');

        $this->mergeConfigFrom(
            __DIR__.'/../Config/users.php',
            'architect::settings.users'
        );
    }

    /**
     * Register views.
     *
     * @return void
     */
    public function registerViews()
    {
        $viewPath = resource_path('views/modules/architect');

        $sourcePath = __DIR__.'/../Resources/views';

        $this->publishes([
            $sourcePath => $viewPath
        ],'views');

        $this->loadViewsFrom(array_merge(array_map(function ($path) {
            return $path . '/modules/architect';
        }, \Config::get('view.paths')), [$sourcePath]), 'architect');
    }

    /**
     * Register translations.
     *
     * @return void
     */
    public function registerTranslations()
    {
        $langPath = resource_path('lang/modules/architect');
        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, 'architect');
        } else {
            $this->loadTranslationsFrom(__DIR__ .'/../Resources/lang', 'architect');
        }
    }

    /**
     * Register an additional directory of factories.
     * @source https://github.com/sebastiaanluca/laravel-resource-flow/blob/develop/src/Modules/ModuleServiceProvider.php#L66
     */
    public function registerFactories()
    {
        if (!app()->environment('production')) {
            app(Factory::class)->load(__DIR__ . '/../Database/factories');
        }
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }
}
