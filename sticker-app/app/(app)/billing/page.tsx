import { getCurrentUser } from "@/lib/auth/session";
import { limitForPlan } from "@/lib/usage";
import { BillingActions } from "@/components/billing-actions";

export default async function BillingPage() {
  const user = (await getCurrentUser())!;
  const isPro = user.plan === "pro";
  const limit = limitForPlan(user.plan);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      <section className="rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Current plan</p>
            <p className="text-xl font-bold capitalize">{user.plan}</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {limit} conversions / mo
          </span>
        </div>
        {user.subscriptionStatus && (
          <p className="mt-3 text-xs text-slate-500">
            Subscription status: {user.subscriptionStatus}
            {user.subscriptionPeriodEnd &&
              ` · renews ${new Date(user.subscriptionPeriodEnd).toLocaleDateString()}`}
          </p>
        )}
      </section>

      <BillingActions isPro={isPro} />

      {!isPro && (
        <ul className="space-y-2 text-sm text-slate-600">
          <li>✓ Up to 300 conversions per month</li>
          <li>✓ Priority processing</li>
          <li>✓ Cancel anytime from the billing portal</li>
        </ul>
      )}
    </div>
  );
}
