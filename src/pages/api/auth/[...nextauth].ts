import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const allowed = (process.env.ADMIN_EMAILS || "")
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        const email = String(credentials?.email || "").trim().toLowerCase();
        const pass = String(credentials?.password || "");
        const okPass = !!process.env.ADMIN_PASSWORD && pass === process.env.ADMIN_PASSWORD;
        if (okPass && (allowed.length === 0 || allowed.includes(email))) {
          return { id: email, email } as any;
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

export default NextAuth(authOptions);
