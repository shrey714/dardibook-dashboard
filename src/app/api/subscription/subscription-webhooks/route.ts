import { storeSubscriptionToFirestore, updateClerkSubscriptionStatus } from "@/lib/actions/SubscriptionHelpers";
import { RazorPayPaymentTypes, RazorPaySubscriptionTypes } from "@/types/SubscriptionTypes";
import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';

export type RazorpayWebhookPayload = {
    event: string;
    payload: {
        subscription?: {
            entity: RazorPaySubscriptionTypes;
        };
        payment?: {
            entity: RazorPayPaymentTypes;
        };
    };
};

export async function POST(req: NextRequest) {
    try {
        const razorpaySignature = req.headers.get("x-razorpay-signature");
        const body = await req.text();

        if (!razorpaySignature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
            console.error("Webhook error:", "Signature/Secret not found");
            return NextResponse.json({ status: "Signature/Secret not found" }, { status: 400 });
        }

        const isValid = validateWebhookSignature(
            body,
            razorpaySignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (!isValid) {
            console.error("Webhook error:", "Invalid signature");
            return NextResponse.json({ status: "Invalid signature" }, { status: 400 });
        }
        const response: RazorpayWebhookPayload = JSON.parse(body);
        const event = response.event;

        console.log("EVENT TYPE============================================================", event)

        const OrgId = response.payload.subscription?.entity.notes.orgid as string | undefined | null

        if (!OrgId) {
            console.error("Webhook error:", "Invalid OrgId");
            return NextResponse.json({ status: "Invalid OrgId" }, { status: 400 });
        }

        switch (event) {
            case "subscription.activated":
                Promise.all([
                    await updateClerkSubscriptionStatus(OrgId, "active", response.payload.subscription?.entity.id || "", response.payload.subscription?.entity.plan_id || "", response.payload.subscription?.entity.current_start, response.payload.subscription?.entity.current_end),
                    await storeSubscriptionToFirestore(OrgId, response.payload, event)])
                break;
            case "subscription.charged":
                Promise.all([
                    await updateClerkSubscriptionStatus(OrgId, "active", response.payload.subscription?.entity.id || "", response.payload.subscription?.entity.plan_id || "", response.payload.subscription?.entity.current_start, response.payload.subscription?.entity.current_end),
                    await storeSubscriptionToFirestore(OrgId, response.payload, event)])
                break;
            case "subscription.completed":
                Promise.all([
                    await updateClerkSubscriptionStatus(OrgId, "completed", response.payload.subscription?.entity.id || "", response.payload.subscription?.entity.plan_id || "", response.payload.subscription?.entity.current_start, response.payload.subscription?.entity.current_end),
                    await storeSubscriptionToFirestore(OrgId, response.payload, event)])
                break;
            case "subscription.paused":
                Promise.all([
                    await updateClerkSubscriptionStatus(OrgId, "paused", response.payload.subscription?.entity.id || "", response.payload.subscription?.entity.plan_id || "", response.payload.subscription?.entity.current_start, response.payload.subscription?.entity.current_end),
                    await storeSubscriptionToFirestore(OrgId, response.payload, event)])
                break;
            case "subscription.resumed":
                Promise.all([
                    await updateClerkSubscriptionStatus(OrgId, "active", response.payload.subscription?.entity.id || "", response.payload.subscription?.entity.plan_id || "", response.payload.subscription?.entity.current_start, response.payload.subscription?.entity.current_end),
                    await storeSubscriptionToFirestore(OrgId, response.payload, event)])
                break;
            case "subscription.pending":
                Promise.all([
                    await updateClerkSubscriptionStatus(OrgId, "pending", response.payload.subscription?.entity.id || "", response.payload.subscription?.entity.plan_id || "", response.payload.subscription?.entity.current_start, response.payload.subscription?.entity.current_end),
                    await storeSubscriptionToFirestore(OrgId, response.payload, event)])
                break;
            case "subscription.halted":
                Promise.all([
                    await updateClerkSubscriptionStatus(OrgId, "halted", response.payload.subscription?.entity.id || "", response.payload.subscription?.entity.plan_id || "", response.payload.subscription?.entity.current_start, response.payload.subscription?.entity.current_end),
                    await storeSubscriptionToFirestore(OrgId, response.payload, event)])
                break;
            case "subscription.cancelled":
                Promise.all([
                    await updateClerkSubscriptionStatus(OrgId, "cancelled", response.payload.subscription?.entity.id || "", response.payload.subscription?.entity.plan_id || "", response.payload.subscription?.entity.current_start, response.payload.subscription?.entity.current_end),
                    await storeSubscriptionToFirestore(OrgId, response.payload, event)])
                break;
            default:
                return NextResponse.json({ status: `Unhandled event ${event}` }, { status: 400 })
        }


        return NextResponse.json({ status: "success" });
    } catch (err) {
        console.error("Webhook error:", err);
        return NextResponse.json({ status: "error", message: err }, { status: 500 });
    }
}