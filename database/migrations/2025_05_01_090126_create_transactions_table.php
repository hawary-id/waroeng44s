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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_code')->nullable()->unique();
            $table->decimal('amount', 12, 2);
            $table->unsignedBigInteger('member_card_id');
            $table->unsignedBigInteger('performed_by');
            $table->foreign('member_card_id')->references('id')->on('member_cards')->onDelete('cascade');
            $table->foreign('performed_by')->references('id')->on('users')->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
