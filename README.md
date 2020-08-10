# dev-tool

https://github.com/nginx-proxy/nginx-proxy#multiple-networks

docker network create -d bridge b3_frontend_default
docker network connect b3_frontend_default devtool_proxy_1