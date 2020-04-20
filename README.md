# dev-tool

https://github.com/nginx-proxy/nginx-proxy#multiple-networks

docker network create -d bridge historia_default
docker network create -d bridge higo_default
docker network create -d bridge vitopsocket_default

docker network connect historia_default devtool_proxy_1
docker network connect higo_default devtool_proxy_1
docker network connect vitopsocket_default devtool_proxy_1