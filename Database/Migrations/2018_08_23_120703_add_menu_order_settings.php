<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMenuOrderSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('menus', function (Blueprint $table) {
          $table->longText('settings')->nullable();
        });

        Schema::table('menus_elements', function (Blueprint $table) {
          $table->longText('settings')->nullable();
          $table->integer('order')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('menus', function($table){
            $table->dropColumn('settings');
        });

        Schema::table('menus_elements', function($table){
          $table->dropColumn('settings');
          $table->dropColumn('order');
        });
    }
}
