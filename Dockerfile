FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
#setting working directory in the container
WORKDIR /app

#copying the package.json file(contains dependencies) from project source dir to container dir
COPY package.json yarn.lock ./

# installing the dependencies into the container
RUN yarn
#copying the source code of Application into the container dir
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn hook

FROM base AS runner
WORKDIR /app

COPY --from=builder /app ./
#container exposed network port number

ENV PORT 5000

EXPOSE 5000
#command to run within the container
CMD ["node", "dist/index.js"]