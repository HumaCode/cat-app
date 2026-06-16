<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class XenditService
{
    /**
     * Get pricing amount based on selected plan.
     */
    public static function getPlanPrice(string $plan): int
    {
        return match ($plan) {
            'professional' => 299000, // Rp 299.000 / bln
            'enterprise' => 999000,   // Rp 999.000 / bln
            default => 0,
        };
    }

    /**
     * Create a Xendit Invoice for the institution subscription.
     */
    public static function createInvoice(Institution $institution, User $admin, string $plan): ?string
    {
        $apiKey = config('services.xendit.secret_key');
        
        if (empty($apiKey)) {
            Log::warning('Xendit Secret Key is not configured in services.php.');
            return null;
        }

        $amount = self::getPlanPrice($plan);
        $externalId = $institution->id;

        $response = Http::withBasicAuth($apiKey, '')
            ->post('https://api.xendit.co/v2/invoices', [
                'external_id' => $externalId,
                'amount' => $amount,
                'payer_email' => $admin->email,
                'description' => 'Langganan CAT System Paket: ' . ucfirst($plan) . ' untuk ' . $institution->name,
                'success_redirect_url' => route('dashboard'),
                'failure_redirect_url' => route('register') . '?plan=' . $plan,
            ]);

        if ($response->failed()) {
            Log::error('Xendit Invoice Creation Failed: ' . $response->body());
            return null;
        }

        return $response->json('invoice_url');
    }
}
