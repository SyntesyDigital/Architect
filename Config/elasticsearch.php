<?php

return [
    'enabled' => env('ELASTICSEARCH_ENABLED', false),

    'hosts' => [
        [
            'host' => env('ELASTICSEARCH_HOST', 'localhost'),
            'port' => env('ELASTICSEARCH_PORT', '9200'),
            'scheme' => env('ELASTICSEARCH_SCHEME', 'http'),
            'user' => env('ELASTICSEARCH_USERNAME', ''),
            'pass' => env('ELASTICSEARCH_PASSWORD', ''),
        ]
    ],

    'index' => env('ELASTICSEARCH_INDEX', 'architect')
];
