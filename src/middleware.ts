import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAuthRoute = createRouteMatcher(['/signin(.*)', '/signup(.*)'])
const isSubscriptionRoute = createRouteMatcher(['/subscription/subscribe(.*)'])
const isHomeRoute = createRouteMatcher(['/dashboard/home(.*)'])
const isAppointmentRoute = createRouteMatcher(['/dashboard/appointment(.*)'])
const isPrescribeRoute = createRouteMatcher(['/dashboard/prescribe(.*)'])
const isHistoryRoute = createRouteMatcher(['/dashboard/history(.*)'])
const isPharmacyRoute = createRouteMatcher(['/dashboard/pharmacy(.*)'])
const isSettingsRoute = createRouteMatcher(['/dashboard/settings(.*)'])

const isApiRoute = createRouteMatcher(['/api(.*)']);
const isSubscriptionWebhookRoute = createRouteMatcher(['/api/subscription/subscription-webhooks(.*)']);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims, orgId } = await auth();
    if (isApiRoute(req) && !isSubscriptionWebhookRoute(req)) {
        await auth.protect();
    }
    if (isSubscriptionRoute(req)) {
        await auth.protect((has) => {
            return (
                has({ role: 'org:clinic_head' }) ||
                has({ role: 'org:doctor' }) ||
                has({ role: 'org:assistant_doctor' }) ||
                has({ role: 'org:medical_staff' })
            )
        })
    }
    if (!userId && !isAuthRoute(req) && !isSubscriptionWebhookRoute(req)) {
        await auth.protect();
    }
    if (userId && !sessionClaims?.metadata?.onboardingComplete && req.nextUrl.pathname !== '/onboarding') {
        const onboardingUrl = new URL('/onboarding', req.url)
        return NextResponse.redirect(onboardingUrl)
    }
    if (userId && !orgId && sessionClaims?.metadata?.onboardingComplete && req.nextUrl.pathname !== "/organizations" && req.nextUrl.pathname !== "/api/create-organization") {
        const url = new URL("/organizations", req.url);
        return NextResponse.redirect(url)
    }
    if (isHomeRoute(req)) {
        await auth.protect((has) => {
            return (
                has({ role: 'org:clinic_head' }) ||
                has({ role: 'org:doctor' }) ||
                has({ role: 'org:assistant_doctor' }) ||
                has({ role: 'org:medical_staff' })
            )
        })
    }
    if (isAppointmentRoute(req)) {
        await auth.protect((has) => {
            return (
                has({ role: 'org:clinic_head' }) ||
                has({ role: 'org:doctor' }) ||
                has({ role: 'org:assistant_doctor' })
            )
        })
    }
    if (isPrescribeRoute(req)) {
        await auth.protect((has) => {
            return (
                has({ role: 'org:clinic_head' }) ||
                has({ role: 'org:doctor' })
            )
        })
    }
    if (isHistoryRoute(req)) {
        await auth.protect((has) => {
            return (
                has({ role: 'org:clinic_head' }) ||
                has({ role: 'org:doctor' }) ||
                has({ role: 'org:assistant_doctor' }) ||
                has({ role: 'org:medical_staff' })
            )
        })
    }
    if (isPharmacyRoute(req)) {
        await auth.protect((has) => {
            return (
                has({ role: 'org:clinic_head' }) ||
                has({ role: 'org:medical_staff' })
            )
        })
    }
    if (isSettingsRoute(req)) {
        await auth.protect((has) => {
            return (
                has({ role: 'org:clinic_head' }) ||
                has({ role: 'org:doctor' }) ||
                has({ role: 'org:assistant_doctor' }) ||
                has({ role: 'org:medical_staff' })
            )
        })
    }




});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};