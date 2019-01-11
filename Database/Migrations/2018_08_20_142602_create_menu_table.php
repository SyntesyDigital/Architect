<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMenuTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('menus_elements', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('menu_id')->unsigned();
            $table->foreign('menu_id')->references('id')->on('menus')->onDelete('cascade');
            $table->nestedSet();
        });

        Schema::create('menus_elements_fields', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('menu_element_id')->unsigned();
            $table->foreign('menu_element_id')->references('id')->on('menus_elements')->onDelete('cascade');

            $table->integer('language_id')->unsigned()->nullable();
            $table->foreign('language_id')->references('id')->on('languages');

            $table->integer('parent_id')->unsigned()->nullable();

            $table->string('name');
            $table->longText('value')->nullable();
            $table->text('relation')->nullable();
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

        Schema::dropIfExists('menus');
        Schema::dropIfExists('menus_elements');
        Schema::dropIfExists('menus_elements_fields');

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
