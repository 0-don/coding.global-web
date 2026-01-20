'use client'

import { usePostHog } from 'posthog-js/react'

export default function CheckoutPage() {
    const posthog = usePostHog()

    function handlePurchase() {
        posthog.capture('purchase_completed', { amount: 99 })
    }

    return <button onClick={handlePurchase}>Complete purchase</button>
}