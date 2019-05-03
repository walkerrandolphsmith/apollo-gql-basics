if [ $# -eq 0 ]
  then
    docker ps -a
    exit 0
fi
docker ps -a | grep $1
