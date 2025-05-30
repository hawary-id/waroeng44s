<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Store>
 */
class StoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Store::class;
    protected static $storeNumber = 1;

    public function definition(): array
    {
        $code = strtoupper('CBG' . str_pad(self::$storeNumber++, 3, '0', STR_PAD_LEFT));
        return [
            'code' => $code,
            'name' => $this->faker->company(),
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
        ];
    }

    public static function resetStoreNumber()
    {
        self::$storeNumber = 1;
    }
}
