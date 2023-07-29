import { getUserByEmail } from "./db/auth";
import CredentialsProvider from "@auth/core/providers/credentials";
import bcrypt from "bcryptjs";

export default {
  secret: process.env.AUTH_SECRET as string,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      // @ts-ignore
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("Missing username or password");
        }

        const user = await getUserByEmail(email);

        if (
          !user ||
          !(
            (await bcrypt.compare(password, user.password)) ||
            password === user.password
          )
        ) {
          // throw new Error("Invalid username or password");
          return null;
        }

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      return { ...session, user: { id: token.sub, email: token.email } };
    },
  },
};

declare module "@auth/core/types" {
  interface Session {
    user?: User;
  }
}
