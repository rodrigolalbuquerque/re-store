"use client";

import Link from "next/link";
import { useState } from "react";

function Home() {
  const [value, setValue] = useState("");

  return (
    <div>
      <div className="bg-lime-600 text-lg font-bold">
        <Link href={`/home/contact?name=${value}`} className="mr-3">
          Contact
        </Link>
        <Link href="/home/profile">Profile</Link>
      </div>
      <form>
        <label htmlFor="name" className="cursor-pointer text-lg font-bold">
          Seu Nome
        </label>
        <input
          type="text"
          name="name"
          id="name"
          onChange={(e) => setValue(e.currentTarget.value)}
          className="ml-2 mt-4 border-2 border-black p-2"
        />
      </form>
    </div>
  );
}

export default Home;
