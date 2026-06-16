<?php

namespace App\Http\Controllers;

use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditWebhookController extends Controller
{
    /**
     * Handle Xendit callback notification.
     */
    public function handle(Request $request)
    {
        $callbackToken = config('services.xendit.callback_token');
        $headerToken = $request->header('x-callback-token');

        if ($callbackToken && $headerToken !== $callbackToken) {
            Log::warning('Xendit Webhook Unauthorized: Callback token mismatch.');
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $externalId = $request->input('external_id');
        $status = $request->input('status');

        Log::info("Xendit Webhook received: External ID {$externalId}, Status {$status}");

        if (in_array($status, ['PAID', 'SETTLED'])) {
            $institution = Institution::find($externalId);

            if ($institution) {
                // Activate/extend subscription for 30 days
                $institution->update([
                    'subscription_ends_at' => now()->addDays(30),
                ]);
                Log::info("Institution subscription activated/extended: {$institution->name}");
            } else {
                Log::error("Xendit Webhook error: Institution ID {$externalId} not found.");
            }
        }

        return response()->json(['status' => 'success']);
    }
}
