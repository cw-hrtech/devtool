docker build -t vitop_backup_db .

docker rm -f vitop_backup_db && docker run -it --name vitop_backup_db vitop_backup_db

docker start vitop_backup_db

