if [ $# -eq 0 ]
  then
    docker rmi -f $(docker images -a -q) 
    exit 0
fi

if [[ $1 -eq "dangling" ]]
  then
  docker rmi $(docker images -f dangling=true)
  else
  docker images -a | grep $1 | awk '{print $3}' | xargs docker rmi
fi
