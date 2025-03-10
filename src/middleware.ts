import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAuthRoute = createRouteMatcher(['/signin(.*)', '/signup(.*)'])
const isSubscriptionRoute = createRouteMatcher(['/subscription/subscribe(.*)'])
const isHomeRoute = createRouteMatcher(['/dashboard/home(.*)'])
const isAppointmentRoute = createRouteMatcher(['/dashboard/appointment(.*)'])
const isPrescribeRoute = createRouteMatcher(['/dashboard/prescribe(.*)'])
const isHistoryRoute = createRouteMatcher(['/dashboard/history(.*)'])
const isMedicalRoute = createRouteMatcher(['/dashboard/medical(.*)'])
const isSettingsRoute = createRouteMatcher(['/dashboard/settings(.*)'])



export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims, orgId } = await auth();
    if (createRouteMatcher(['/api(.*)'])(req)) {
        await auth.protect();
    }
    if (isSubscriptionRoute(req)) {
        await auth.protect((has) => {
            return (
                has({ role: 'org:clinic_head' })
            )
        })
    }
    if (!userId && !isAuthRoute(req)) {
        await auth.protect();
    }
    if (userId && !sessionClaims?.metadata?.onboardingComplete && req.nextUrl.pathname !== '/onboarding') {
        const onboardingUrl = new URL('/onboarding', req.url)
        return NextResponse.redirect(onboardingUrl)
    }
    //  && req.nextUrl.pathname !== "/api/create-organization"
    if (userId && !orgId && sessionClaims?.metadata?.onboardingComplete && req.nextUrl.pathname !== "/create-organization") {
        const url = new URL("/create-organization", req.url);
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
    if (isMedicalRoute(req)) {
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