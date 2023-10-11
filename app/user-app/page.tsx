import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";

export default async function UserApp() {
  let loggedIn = false;
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) loggedIn = true;
  } catch (error) {
    console.log("UserApp", error);
  } finally {
    if (!loggedIn) redirect("/", RedirectType.replace);
  }

  return <div>User Logged in!</div>;
}
