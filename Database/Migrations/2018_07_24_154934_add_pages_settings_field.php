<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPagesSettingsField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->longText('settings')->nullable();
        });

        Schema::table('pages_layouts', function (Blueprint $table) {
            $table->longText('settings')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pages', function($table){
            $table->dropColumn('settings');
        });

        Schema::table('pages_layouts', function($table){
            $table->dropColumn('settings');
        });
    }
}
