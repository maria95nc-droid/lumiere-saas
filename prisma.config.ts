import path from "path";

const config = {
  earlyAccess: true,
  schema: path.join(process.cwd(), "prisma", "schema.prisma"),
};

export default config;
