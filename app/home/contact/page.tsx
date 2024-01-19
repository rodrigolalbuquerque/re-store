"use client";

import { useSearchParams } from "next/navigation";

function Contact() {
  const name = useSearchParams().get("name");

  return <div className="bg-red-500 text-lg font-bold">{name}</div>;
}

export default Contact;
