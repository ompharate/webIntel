"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Plan {
  _id: string;
  planName: string;
  description: string;
  amount: string;
}

interface User {
  maxLimit: number;
  currentLimit: number;
}

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user) return;
      const response = await fetch(`/api/user?id=${session?.user?.id}`, {
        method: "GET",
      });
      const data = await response.json();
      setUser(data.user);
    };

    fetchUser();
  }, [session?.user]);
  console.log("user", user);
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
      body: JSON.stringify({
        amount: amountInPaise,
        planName,
        planId: id,
        userId: session?.user?.id,
      }),
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
          setDialogOpen(false);
          router.refresh();
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

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="bg-[#09090B] flex justify-between items-start p-4">
      <h1 className="text-2xl font-semibold text-white">WebIntel</h1>
      <div className="flex items-center gap-5">
        <Badge variant="destructive">
          {user?.currentLimit} / {user?.maxLimit}
        </Badge>
        {session?.user ? (
          <Button onClick={handleLogout} variant="secondary">
            {session?.user?.name} (Logout){" "}
          </Button>
        ) : null}
        {session?.user ? (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Upgrade</Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[600px]">
              <DialogHeader>
                <DialogTitle>Plans</DialogTitle>
                <DialogDescription>
                  Diwali offer available! Get 20% off with the ₹299 plan and
                  have fun.
                </DialogDescription>
              </DialogHeader>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-center space-x-2">
                {plans.map((plan) => (
                  <div key={plan._id}>
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
                            handlePayment(plan.amount, plan.planName, plan._id);
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
        ) : (
          <Link
            className="text-black, p-2 rounded-lg font-semibold bg-secondary"
            href={"/api/auth/signin"}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
