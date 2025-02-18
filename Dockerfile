FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
COPY postcss.config.js tailwind.config.js ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
