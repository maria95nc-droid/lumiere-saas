content = open('prisma/schema.prisma').read()
content = content.replace(
    '  status       String   @default("draft")',
    '  status       String   @default("draft")\n  theme        String?  @default("premium")\n  slogan       String?\n  email        String?\n  instagram    String?\n  facebook     String?\n  years        String?\n  treatments   String?\n  primaryColor String?  @default("#c9907a")'
)
open('prisma/schema.prisma', 'w').write(content)
print("OK - schema actualizado")
