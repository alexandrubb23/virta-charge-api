FROM postgres:latest

# Install the PostGIS extension
RUN apt-get update && apt-get install -y postgis
