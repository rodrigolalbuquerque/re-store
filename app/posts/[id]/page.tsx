import { PostProtocol } from "../page";

type PostDetailsPageProtocol = {
  params: {
    id: string;
  };
};

async function page({ params }: PostDetailsPageProtocol) {
  const request = await fetch("https://jsonplaceholder.typicode.com/posts");
  const fullPostList: PostProtocol[] = await request.json();
  const postList = fullPostList.slice(0, 5);
  const postDetails = postList.slice().filter((post) => {
    return String(post.id) === params.id[0];
  });

  return (
    <div className="bg-red-300">
      <p>{`User Id: ${postDetails[0].userId}`}</p>
      <p>{`Post Id: ${postDetails[0].id}`}</p>
      <p>{`Title: ${postDetails[0].title}`}</p>
      <p>{`Description: ${postDetails[0].body}`}</p>
    </div>
  );
}

export default page;
