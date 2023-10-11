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

export default function CreateAccountForm() {
  const router = useRouter();
  const form = useForm<Tform>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: Tform) => {
    try {
      const supabase = createClientComponentClient();
      const { email, password } = values;

      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) console.log("create-account-form", error.message);

      // options: {
      //   emailRedirectTo: `${location.origin}/auth/callback`,
      // },

      //como não vou usar confirmação no email, posso deixar essa opção comentada

      /*
          { email, password } é o mesmo que { email: email, password: password }
              -> posso usar abreviado já que as chaves que preciso passar possuem os mesmos nomes das 
              variáveis
      */
      if (user) {
        form.reset();
        // router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.log("createAccountForm", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <span className="text-lg">Create your Account</span>
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
          <Button type="submit">Create Account</Button>
        </form>
      </Form>
    </div>
  );
}
