import Link from "next/link";

function Layout({ children }: { children: React.ReactNode }) {
  const randomNumber = Math.floor(Math.random() * 20);

  return (
    <div>
      <div className="bg-orange-300 text-lg font-bold">
        <Link href="/home" className="mr-10">
          Home
        </Link>
        {randomNumber}
      </div>
      {children}
    </div>
  );
}

export default Layout;
