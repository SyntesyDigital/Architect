<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTableTypologyAddCategoriesAndTagsBool extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('typologies', function($table){
            $table->boolean('has_categories')->nullable();
            $table->boolean('has_tags')->nullable();
            $table->boolean('has_slug')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('typologies', function($table){
            $table->dropColumn('has_categories');
            $table->dropColumn('has_tags');
            $table->dropColumn('has_slug');
        });
    }
}
