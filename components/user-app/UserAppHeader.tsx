import { UserNav } from "../common/user-nav";

export default function UserAppHeader() {
  return (
    <header>
      <nav className="flex items-center justify-between p-2">
        <span className="font-extrabold">
          re<span className="text-pink-500">Store</span>
        </span>
        <UserNav />
      </nav>
    </header>
  );
}
