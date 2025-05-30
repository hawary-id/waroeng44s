<?php

namespace App\Console\Commands;

use App\Models\MemberCard;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ExpireMemberCards extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:expire-member-cards';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $updated = MemberCard::where('active', true)
            ->whereDate('expired_at', '<', Carbon::today())
            ->update(['active' => false]);

        $this->info("Total $updated member cards dinonaktifkan.");
    }
}
