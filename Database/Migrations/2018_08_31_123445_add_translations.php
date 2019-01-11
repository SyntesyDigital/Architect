<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTranslations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->integer('order');
            $table->timestamps();
        });

        Schema::create('translations_fields', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('translation_id')->unsigned();
            $table->foreign('translation_id')->references('id')->on('translations')->onDelete('cascade');

            $table->integer('language_id')->unsigned()->nullable();
            $table->foreign('language_id')->references('id')->on('languages');

            $table->string('name');
            $table->longText('value')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Schema::dropIfExists('translations');
        Schema::dropIfExists('translations_fields');

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
