<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('member_cards', function (Blueprint $table) {
            $table->id();
            $table->string('card_number')->unique();
            $table->decimal('balance', 12, 2)->default(0.00);
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('issued_by')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('issued_by')->references('id')->on('users')->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_cards');
    }
};
