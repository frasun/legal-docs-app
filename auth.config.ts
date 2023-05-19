import { _getUserByEmail } from "./db/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

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

        const user = await _getUserByEmail(email);

        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid username or password");
        }

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
};
