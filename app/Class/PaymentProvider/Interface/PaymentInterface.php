<?php

namespace App\Class\PaymentProvider\Interface;

use App\Models\User;
use Illuminate\Http\Request;

interface PaymentInterface
{
    public function generate(User $user): array|null;
    public function connect(): mixed;
    public function checkBalance(): ?string;
    public function webhook(Request $request): void;
    public function isHealthy(): bool;
    public function checkout(array $data): array;
    public function banks(): array;
    public function resolveBank(array $bank);
    public function transfer(array $data);
}
