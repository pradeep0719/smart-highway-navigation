# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build-time env (Vite embeds these into the bundle)
ARG VITE_API_URL=/api
ARG VITE_GOOGLE_MAPS_API_KEY=
ARG VITE_APP_NAME=Smart Highway Navigation
ARG VITE_OSRM_BASE_URL=https://router.project-osrm.org
ARG VITE_NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_OSRM_BASE_URL=$VITE_OSRM_BASE_URL
ENV VITE_NOMINATIM_BASE_URL=$VITE_NOMINATIM_BASE_URL

RUN npm run build

# Stage 2: Serve with nginx (static files + API reverse proxy)
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
