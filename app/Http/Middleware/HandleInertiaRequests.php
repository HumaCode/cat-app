<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'active_exams_count' => $request->user()->role === 'peserta' ? \App\Models\Exam::where('institution_id', $request->user()->institution_id)
                        ->where('status', 'aktif')
                        ->whereJsonContains('settings->participants', $request->user()->id)
                        ->get()
                        ->filter(function ($exam) use ($request) {
                            $riwayat = is_array($request->user()->exam_data) && isset($request->user()->exam_data['riwayat']) ? $request->user()->exam_data['riwayat'] : [];
                            $attemptsLimit = $exam->settings['attempts_limit'] ?? 0;
                            if ($attemptsLimit > 0) {
                                $attemptsCount = collect($riwayat)->where('nama', $exam->title)->count();
                                return $attemptsCount < $attemptsLimit;
                            }
                            return true;
                        })->count() : 0
                ]) : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
