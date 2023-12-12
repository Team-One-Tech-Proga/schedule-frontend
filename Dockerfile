# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.1.0

################################################################################
# Use node image for build stages.
FROM node:${NODE_VERSION}-alpine as build

# Set working directory for build stages.
WORKDIR /usr/src/app

COPY . .

RUN npm run build

################################################################################
FROM nginx as final

# Copy the production build to nginx static directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
