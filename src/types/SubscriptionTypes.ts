
interface IMap<T> {
    [key: string]: T | null;
}

export interface RazorPayPlanTypes {
    id: string;
    entity: string;
    interval: number;
    period: "daily" | "weekly" | "monthly" | "yearly";
    item: {
        id: string;
        active: boolean;
        name: string;
        description?: string;
        amount: number | string;
        unit_amount: number;
        currency: string;
        type: string;
        unit: number | null;
        tax_inclusive: boolean;
        hsn_code: number | null;
        sac_code: number | null;
        tax_rate: number | null;
        tax_id: string | null;
        tax_group_id: string | null;
        created_at: number;
        updated_at: number;
    };
    notes?: IMap<string | number>;
    created_at: number;
}


export interface ClerkSubscriptiontypes {
    status: string;
    sub_id: string;
    plan_id: string;
    current_start?: number | null | undefined,
    current_end?: number | null | undefined,
}

export interface RazorPaySubscriptionTypes {
    id: string;
    entity: string;
    plan_id: string;
    customer_id: string | null;
    status:
    | 'active'
    | 'pending'
    | 'halted'
    | 'paused'
    | 'cancelled'
    | 'completed';
    current_start: number | null;
    current_end: number | null;
    ended_at: number | null;
    quantity: number;
    notes: IMap<string | number>;
    charge_at: number;
    start_at: number;
    end_at: number;
    auth_attempts: number;
    total_count: number;
    paid_count: number;
    customer_notify: boolean | 0 | 1;
    created_at: number;
    expire_by: number | null;
    short_url: string | null;
    has_scheduled_changes: boolean;
    change_scheduled_at: number | null;
    source: string;
    payment_method: string | null;
    offer_id: string | null;
    remaining_count: number;
}

export interface RazorPayPaymentTypes {
    id: string;
    entity: 'payment';
    amount: number | string;
    currency: string;
    status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
    order_id: string;
    invoice_id: string | null;
    international: boolean;
    method: string;
    amount_refunded?: number;
    amount_transferred?: number;
    refund_status: 'null' | 'partial' | 'full';
    captured: string;
    description?: string;
    card_id: string | null;
    card?: any;
    bank?: string | null;
    wallet: null;
    vpa: null;
    email: string;
    contact: string | number;
    customer_id: string;
    token_id: string | null;
    notes: IMap<string | number>;
    fee: number;
    tax: number;
    error_code: string | null;
    error_description: string | null;
    created_at: number;
}