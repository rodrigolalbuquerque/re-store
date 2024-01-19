"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type LinkObjectProtocol = {
  name: string;
  href: string;
};

type NavLinksProtocol = {
  navlink: LinkObjectProtocol[];
};

const Navigation = ({ navlink }: NavLinksProtocol) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav>
      <ul className="flex bg-slate-600 p-2">
        {navlink.map((link) => {
          return (
            <li
              className={`${
                link.href === pathname ? "text-red-400" : "text-white"
              } mx-2 text-xl font-bold`}
              key={link.href}
            >
              {/* <Link href={link.href}>{link.name}</Link> */}
              <button type="button" onClick={() => router.push(link.href)}>
                {link.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
