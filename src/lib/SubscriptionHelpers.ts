"use server"

import { clerkClient } from '@clerk/nextjs/server'
import { adminDb } from "@/server/firebaseAdmin";
import { RazorpayWebhookPayload } from '@/app/api/subscription/subscription-webhooks/route';
import Razorpay from "razorpay";
import * as crypto from "crypto";
import { addMonths, endOfDay, getUnixTime, startOfToday } from 'date-fns';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function storeSubscriptionToFirestore(
    orgId: string,
    subscriptiondata: RazorpayWebhookPayload["payload"],
    event: string,
) {
    try {
        const data: Record<string, any> = {
            event,
        };
        if (subscriptiondata.subscription?.entity) {
            data.subscription = subscriptiondata.subscription.entity;
        }
        if (subscriptiondata.payment?.entity) {
            data.payment = subscriptiondata.payment.entity;
        }
        await adminDb
            .collection("doctor")
            .doc(orgId)
            .collection("subscriptions")
            .add(data);
    } catch (error) {
        console.error("Error adding subscription data:", error);
        throw new Error(`Failed to store subscription data in Firestore: ${error}`);
    }
}

export async function updateClerkSubscriptionStatus(
    orgId: string,
    status: string,
    current_start: number | null | undefined,
    current_end: number | null | undefined,
) {
    try {
        const client = await clerkClient();

        const subscriptionMetadata: Record<string, any> = { status };

        if (typeof current_start === "number") {
            subscriptionMetadata.current_start = current_start;
        }

        if (typeof current_end === "number") {
            subscriptionMetadata.current_end = current_end;
        }

        await client.organizations.updateOrganizationMetadata(orgId, {
            publicMetadata: {
                subscription: subscriptionMetadata,
            },
        });
    } catch (error) {
        console.error("Error updating Clerk metadata:", error);
        throw new Error(`Failed to update Clerk subscription metadata: ${error}`);
    }
}

export async function createSubscriptionWithUserNote({
    planId,
    total_count,
    customer_notify,
    orgid,
}: {
    planId: string;
    total_count: number;
    customer_notify: number,
    orgid: string;
}) {
    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: total_count,
            customer_notify: customer_notify as 0 | 1,
            notes: {
                orgid,
            },
        });

        return subscription;
    } catch (error) {
        console.error("Error creating Razorpay subscription:", error);
        throw new Error("Failed to create subscription");
    }
}

type RazorpayHandlerResponse = {
    razorpay_payment_id: string;
    razorpay_signature: string;
    razorpay_subscription_id: string;
};

export async function verifyAndActivateSubscription({
    response,
    subscriptionId,
    orgId,
}: {
    response: RazorpayHandlerResponse;
    subscriptionId: string;
    orgId: string;
}) {
    try {
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${response.razorpay_payment_id}|${subscriptionId}`)
            .digest("hex");

        const isLegit = expectedSignature === response.razorpay_signature;

        if (isLegit && orgId) {
            await updateClerkSubscriptionStatus(orgId, "active", getUnixTime(startOfToday()), getUnixTime(endOfDay(addMonths(new Date(), 1))));
            return { success: true };
        } else {
            return { success: false, reason: "Invalid signature" };
        }
    } catch (error) {
        console.error("Error in verifyAndActivateSubscription:", error);
        return { success: false, reason: "Server error" };
    }
}