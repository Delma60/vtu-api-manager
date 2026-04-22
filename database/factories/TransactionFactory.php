<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['airtime', 'data', 'electricity', 'cable'];
        $networks = ['mtn', 'airtel', 'glo', '9mobile', 'ikedc', 'dstvn', 'gotv'];
        $statuses = ['pending', 'processing', 'successful', 'failed', 'refunded'];

        $type = $this->faker->randomElement($types);
        $network = $this->faker->randomElement($networks);
        $amount = $this->faker->numberBetween(100, 50000);
        $cost = $this->faker->numberBetween(50, $amount - 10);

        // Generate destination based on network type
        if (in_array($network, ['mtn', 'airtel', 'glo', '9mobile'])) {
            // Phone numbers
            $destination = '0' . $this->faker->numberBetween(7, 9) . str_pad($this->faker->numberBetween(0, 9999999999), 10, '0', STR_PAD_LEFT);
        } else {
            // Meter/smartcard numbers
            $destination = str_pad($this->faker->numberBetween(1000000000, 9999999999), 10, '0', STR_PAD_LEFT);
        }

        $previousBalance = $this->faker->numberBetween(10000, 100000);

        return [
            'transaction_reference' => 'txn_' . Str::random(12),
            'vendor_reference' => $this->faker->randomElement([null, 'ven_' . Str::random(15)]),
            'type' => $type,
            'network' => $network,
            'destination' => $destination,
            'amount' => $amount,
            'cost' => $cost,
            'previous_balance' => $previousBalance,
            'new_balance' => $previousBalance - $cost,
            'status' => $this->faker->randomElement($statuses),
            'meta_data' => [
                'initiated_at' => now()->subMinutes($this->faker->numberBetween(1, 1440))->toIso8601String(),
                'response_code' => $this->faker->regexify('[A-Z0-9]{6}'),
                'provider_message' => $this->faker->sentence(3),
            ],
        ];
    }
}
