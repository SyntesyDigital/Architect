<?php

return [
    'mysql_testing' => [
        'driver' => env('DB_TEST_CONNECTION', 'mysql'),
        'host' => env('DB_TEST_HOST', '127.0.0.1'),
        'port' => env('DB_TEST_PORT', '3306'),
        'database' => env('DB_TEST_DATABASE', 'architect_test'),
        'username' => env('DB_TEST_USERNAME', 'forge'),
        'password' => env('DB_TEST_PASSWORD', ''),
        'unix_socket' => env('DB_TEST_SOCKET', ''),
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
        'strict' => false,
        'engine' => null,
    ],

    'sqlite_testing' => [
        'driver'   => 'sqlite',
        //'database' => database_path('database_testing.sqlite'),
        'database' => ':memory:',
        'prefix'   => '',
        'exec'     => 'PRAGMA foreign_keys = ON;',  //enable delete cascade
    ],
];
