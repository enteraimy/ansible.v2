version: '3.0'

services:

  proxy:
    image: jwilder/nginx-proxy
    ports:
      - {{ ports }}:80
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
    networks:
      - proxy

networks:
  proxy:
    driver: bridge
