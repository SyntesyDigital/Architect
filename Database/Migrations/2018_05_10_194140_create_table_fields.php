<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableFields extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('fields', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('typology_id')->unsigned();
            $table->foreign('typology_id')->references('id')->on('typologies')->onDelete('cascade');

            $table->string('identifier');
            $table->string('name');
            $table->string('type');
            $table->string('icon')->nullable();
            $table->string('rules')->nullable();
            $table->longText('settings')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Schema::dropIfExists('fields');

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
