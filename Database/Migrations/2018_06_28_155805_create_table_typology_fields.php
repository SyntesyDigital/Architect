<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTypologyFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('typologies_attributes', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('typology_id')->unsigned();
            $table->foreign('typology_id')->references('id')->on('typologies')->onDelete('cascade');

            $table->integer('language_id')->unsigned()->nullable();
            $table->foreign('language_id')->references('id')->on('languages');

            $table->string('name');
            $table->longText('value')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('typologies_attributes');
    }
}
