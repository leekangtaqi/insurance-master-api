FROM tbaltrushaitis/ubuntu-nodejs:latest

MAINTAINER Rick Lee <leekangtaqi@sina.com>

ENV workDir /insurance-master-api

RUN mkdir -p ${workDir} &&\ 
  sed -i 's/deb.debian.org/mirrors.aliyun.com/' /etc/apt/sources.list &&\
  apt-get update &&\
  apt-get install -qq libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++ &&\
  npm config set registry https://registry.npm.taobao.org

WORKDIR ${workDir}

COPY . ./

RUN npm install -g pm2 &&\
  npm install --production

CMD ["pm2-docker", "pm2.docker.json"]

EXPOSE 9191