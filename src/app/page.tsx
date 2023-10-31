import Post from "@/components/Post";

const getPosts = async () => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`, { cache: "no-store" });

    if (res.ok) {
      const posts = await res.json();
      return posts.result;
    }
  } catch (error) {
    console.log(error)
  }

  return null;
}

export default async function Home() {

  const posts: PostTypes[] = await getPosts();

  return (
    <main className="container p-1 flex justify-center items-center flex-col">
      <h1 className="text-3xl my-2 font-extrabold">Trending</h1>
      {posts?.length > 0 ? posts?.map((post, index) => (
        <Post key={index} post={post} />
      )) : <p>No posts to display</p>}
    </main>
  )
}
