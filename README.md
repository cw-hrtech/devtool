# dev-tool

https://github.com/nginx-proxy/nginx-proxy#multiple-networks

docker rm -f devtool_proxy_1 && docker-compose up -d proxy && docker network connect historia_default devtool_proxy_1&& docker-compose exec proxy bash