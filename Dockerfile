# ... (partes anteriores iguais)

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# IMPORTANTE: Gerar o prisma antes do build
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
# O Easypanel geralmente lida com as ENVs, mas garantir aqui ajuda no build
ENV NEXT_OUTPUT_MODE=standalone

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia o necessário para o Prisma funcionar em runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copia o standalone e static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# No Easypanel, certifique-se que a DATABASE_URL está nas Environment Variables do painel
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
