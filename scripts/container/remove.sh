if [ $# -eq 0 ]
  then
    docker rm $(docker ps -a -q)
    exit 0
fi
docker ps -a | grep $1 | awk '{print $3}' | xargs docker rmi
