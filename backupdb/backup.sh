#!/bin/bash

cd /backup

TODAY=`date +"%d%m%Y"`
echo "TEST $TODAY" >> /var/log/cron

# /3 => 2 lan backup
KEEP_VERSION=6

DATABASES=("vitop" "vitop_craw" "vitop_news")

MYSQL_HOST='prod-historia-master-db.cgqkbplitud3.ap-southeast-1.rds.amazonaws.com'
MYSQL_PORT='3306'
MYSQL_USER='master'
MYSQL_PASSWORD='12345678'

MYSQL_BACKUP_HOST='1.55.215.8'
MYSQL_BACKUP_PORT='3306'
MYSQL_BACKUP_USER='root'
MYSQL_BACKUP_PASSWORD='pnoe5HZx9Ui9bjdNW06JfyLUdYOAikxv'

echo "------------------ Start backup data ------------------"

for db in "${DATABASES[@]}"
do
  echo "$db"
  mysqldump -h ${MYSQL_HOST} \
     -P ${MYSQL_PORT} \
     -u ${MYSQL_USER} \
     -p${MYSQL_PASSWORD} --set-gtid-purged=OFF \
     ${db} | gzip > ${db}_${TODAY}.sql.gz

  mysqladmin -h ${MYSQL_BACKUP_HOST} \
    -P ${MYSQL_BACKUP_PORT} \
    -u ${MYSQL_BACKUP_USER} \
    -p${MYSQL_BACKUP_PASSWORD} create "${db}_${TODAY}"

  zcat ${db}_${TODAY}.sql.gz | mysql -h ${MYSQL_BACKUP_HOST} \
    -P ${MYSQL_BACKUP_PORT} \
    -u ${MYSQL_BACKUP_USER} \
    -p${MYSQL_BACKUP_PASSWORD} \
    "${db}_${TODAY}"

done

rsync -a --delete /backup root@${MYSQL_BACKUP_HOST}:/var/www/higo/code/backup/database

echo "------------------ Start delete data ------------------"

directories=$(ls -t | grep .gz)
SAVEIFS=$IFS     # Save current IFS
IFS=$'\n'        # Change IFS to new line
directories=($directories) # split to array $names
IFS=$SAVEIFS     # Restore IFS

i=0
for item in "${directories[@]}"
do
  if [ $i -lt ${KEEP_VERSION} ]; then
    echo -e "\e[34mKeep version: ${item}\e[39m"
  else
    echo -e "\e[31mRemove version: ${item}\e[39m"
    dbName="${item/'.sql.gz'/''}"
    echo "Start drop DB ${dbName}"
    mysqladmin -h ${MYSQL_BACKUP_HOST} \
    -P ${MYSQL_BACKUP_PORT} \
    -u ${MYSQL_BACKUP_USER} \
    -p${MYSQL_BACKUP_PASSWORD} -f drop "${dbName}"
     rm -rf ${item}
  fi
  i=$((i + 1))
done


curl -X POST --data-urlencode "payload={\"channel\": \"#backup_higio\", \"username\": \"webhookbot\", \"text\": \"${TODAY}: Database Vitop Production đã được backup về server HIGIO thành công\nXem chi tiết tại đây: http://localhost:8080/.\", \"icon_emoji\": \":ghost:\"}" https://co-well.chatops.vn/hooks/rkxmk85qmbyrfdxypwngkwey7a
