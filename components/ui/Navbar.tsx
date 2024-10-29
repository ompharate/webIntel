"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Plan {
  id: string;
  planName: string;
  description: string;
  amount: string;
}

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans/all", { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch plans");
        const data = await response.json();
        setPlans(data.plans);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    };
    fetchPlans();
  }, []);

  const handlePayment = async (
    amount: string,
    planName: string,
    id: string
  ) => {
    if (planName == "Free") {
      return;
    }

    setLoading(true);
    const amountInPaise = parseInt(amount) * 100;

    const response = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amountInPaise }),
    });

    const data = await response.json();

    setLoading(false);
    if (response.ok) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.response.amount,
        currency: data.response.currency,
        name: "WebIntel",
        description: "Test Transaction",
        order_id: data.response.id,
        handler: function (response: { razorpay_payment_id: string }) {
          alert("Payment successful: " + response.razorpay_payment_id);
          setDialogOpen(false);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#09090B",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      alert("Error creating order");
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#09090B] flex justify-between items-start p-4">
      <h1 className="text-2xl font-semibold text-white">WebIntel</h1>
      <div className="flex items-center gap-5">
        <Badge variant="secondary">{session?.user?.name}</Badge>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              {session?.user ? "Upgrade" : "Login"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl h-[600px]">
            <DialogHeader>
              <DialogTitle>Plans</DialogTitle>
              <DialogDescription>
                Diwali offer available! Get 20% off with the ₹299 plan and have
                fun.
              </DialogDescription>
            </DialogHeader>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-center space-x-2">
              {plans.map((plan) => (
                <div key={plan.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{plan.planName}</CardTitle>
                      <CardDescription>For limited use</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{plan.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        disabled={loading}
                        onClick={() => {
                          handlePayment(plan.amount, plan.planName, plan.id);
                          setDialogOpen(false);
                        }}
                      >
                        {plan.amount === "0" ? "Current" : "₹" + plan.amount}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Navbar;
