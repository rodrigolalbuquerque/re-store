"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Must be a valid email." }),
  password: z
    .string({ required_error: "Password is required" })
    .min(7, { message: "Must have between 7 and 12 characters" })
    .max(12, { message: "Must have between 7 and 12 characters" }),
});

type Tform = z.infer<typeof formSchema>;

export default function LoginAccountForm() {
  const router = useRouter();
  const form = useForm<Tform>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: Tform) => {
    let loginError = "";
    try {
      const supabase = createClientComponentClient();
      const { email, password } = values;
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) loginError = error.message;
    } catch (error) {
      console.log("LoginAccountForm:onsubmit", error);
    }

    form.reset();
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <span className="text-lg">Log in with your Account</span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
                <FormDescription>This is your E-mail</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} type="password" />
                </FormControl>
                <FormDescription>This is your Password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Log In</Button>
        </form>
      </Form>
    </div>
  );
}
