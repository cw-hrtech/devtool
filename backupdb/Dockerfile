FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y mysql-client curl nano openssh-client rsync

# Set Timezone
#--------------------------------------------------------------------------
ENV TZ Asia/Bangkok
RUN apt-get install -y tzdata \
    && echo $TZ > /etc/timezone

#--------------------------------------------------------------------------
# Crontab
#--------------------------------------------------------------------------
RUN apt-get install -y cron
RUN mkdir -p /etc/periodic/daily
ADD ./backup.sh /etc/periodic/daily
COPY ./cron/root /var/spool/cron/crontabs/root
RUN chmod 0777 /etc/periodic/daily/backup.sh


ADD ./startup.sh /opt/startup.sh

RUN mkdir -p /backup

ENTRYPOINT ["/bin/bash"]
CMD ["/opt/startup.sh"]
