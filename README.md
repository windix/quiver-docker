# Quiver Local Search

docker run -it --rm -p 8001:8001 -v $(pwd):/mnt datasetteproject/datasette \
  datasette -p 8001 -h 0.0.0.0 --cors /mnt/quiver.db

docker build . -t quiver-converter:latest
