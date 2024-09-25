# Docker Multi Arch

Build the amd64 version on my PC.

```
docker build --build-arg VERSION=0.64.8 . -t windix/datasette-amd64:0.64.8
docker push windix/datasette-amd64:0.64.8
```

Build the arm64 version on my Mac.

```
docker build --build-arg VERSION=0.64.8 . -t windix/datasette-arm64:0.64.8
docker push windix/datasette-arm64:0.64.8
```

Create a manifest:

```
❯ docker manifest create windix/datasette:0.64.8 windix/datasette-amd64:0.64.8 windix/datasette-arm64:0.64.8
Created manifest list docker.io/windix/datasette:0.64.8
```

Inspect:

```
❯ docker manifest inspect windix/datasette:0.64.8
{
   "schemaVersion": 2,
   "mediaType": "application/vnd.docker.distribution.manifest.list.v2+json",
   "manifests": [
      {
         "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
         "size": 1793,
         "digest": "sha256:5fc406c984403aad8ddb34f6fd5a78776b250e1d2fb822aa02c86b4440756046",
         "platform": {
            "architecture": "amd64",
            "os": "linux"
         }
      },
      {
         "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
         "size": 1793,
         "digest": "sha256:35b0e73869da395b4afd5551db98b8d319e0a0a0288b9249ed6053bc9d06352a",
         "platform": {
            "architecture": "arm64",
            "os": "linux",
            "variant": "v8"
         }
      }
   ]
}
```

Push!

```
❯ docker manifest push windix/datasette:0.64.8
Pushed ref docker.io/windix/datasette@sha256:5fc406c984403aad8ddb34f6fd5a78776b250e1d2fb822aa02c86b4440756046 with digest: sha256:5fc406c984403aad8ddb34f6fd5a78776b250e1d2fb822aa02c86b4440756046
Pushed ref docker.io/windix/datasette@sha256:35b0e73869da395b4afd5551db98b8d319e0a0a0288b9249ed6053bc9d06352a with digest: sha256:35b0e73869da395b4afd5551db98b8d319e0a0a0288b9249ed6053bc9d06352a
sha256:bff356d4c98f1e11cb600c5f1a5284848b56fa2360d69e69f681222bb7cf2373
```
