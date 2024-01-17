import Link from "next/link";

export type PostProtocol = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function posts() {
  const request = await fetch("https://jsonplaceholder.typicode.com/posts");
  const postList: PostProtocol[] = await request.json();

  const firstFivePosts = postList.slice(0, 5);

  return (
    <div className="flex h-screen items-center justify-center overflow-hidden">
      <div className="spaceb flex h-72 flex-col justify-between text-2xl font-bold">
        {firstFivePosts.map((post) => {
          return (
            <p key={post.id}>
              <Link
                className="cursor-pointer hover:text-red-400"
                href={`/posts/${String(post.id)}`}
              >
                {post.title}
              </Link>
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default posts;
