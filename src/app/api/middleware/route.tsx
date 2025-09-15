// import axios from "axios";

export async function GET() {
  //   const res = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_URL}/users/middleware`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         // forward whatever cookies were included on the incoming request
  //         // Cookie: cookieHeader,
  //       },
  //       withCredentials: true,
  //     }
  //   );
  //   console.log(res.data);
  return new Response(
    JSON.stringify({ message: "Middleware API is working!" }),
    { status: 200 }
  );
}
