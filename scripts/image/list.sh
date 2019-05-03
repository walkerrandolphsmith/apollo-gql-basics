if [ $# -eq 0 ]
  then
    docker images -a
    exit 0
fi
docker images -a |  grep $1
