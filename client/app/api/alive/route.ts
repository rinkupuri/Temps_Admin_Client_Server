import axios from "axios";

export async function GET() {
  const res = await axios.get("https://temps-admin-client-server.onrender.com");

  return Response.json({ message: res.data });
}
