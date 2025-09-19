import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock, UserPlus } from "lucide-react";

export default function Auth() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const onSubmit = (mode: "login" | "register", e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(mode);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const name = String(form.get("name") || "");
    setTimeout(() => {
      setLoading(null);
      toast({
        title: mode === "login" ? "Logged in" : "Account created",
        description:
          mode === "login"
            ? `Welcome back${name ? ", " + name : ""}!`
            : `You're all set${name ? ", " + name : ""}. Start simplifying documents.`,
      });
    }, 800);
  };

  return (
    <section className="relative py-12 md:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,theme(colors.purple.500/10),transparent_45%),radial-gradient(ellipse_at_bottom_left,theme(colors.blue.500/10),transparent_45%)]" />
      <div className="container max-w-xl">
        <Card className="backdrop-blur">
          <CardHeader>
            <CardTitle>Access your workspace</CardTitle>
            <CardDescription>Login or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <form className="space-y-4" onSubmit={(e) => onSubmit("login", e)}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" placeholder="you@company.com" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input name="password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button disabled={loading === "login"} className="w-full">
                    <Lock className="mr-2 h-4 w-4" /> {loading === "login" ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register" className="space-y-4">
                <form className="space-y-4" onSubmit={(e) => onSubmit("register", e)}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full name</label>
                    <Input name="name" type="text" placeholder="Kritika Sah" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" placeholder="you@company.com" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input name="password" type="password" placeholder="Create a strong password" required />
                  </div>
                  <Button disabled={loading === "register"} className="w-full" variant="secondary">
                    <UserPlus className="mr-2 h-4 w-4" /> {loading === "register" ? "Creating..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
