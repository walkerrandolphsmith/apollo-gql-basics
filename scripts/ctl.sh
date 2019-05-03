#!/usr/bin/env bash

clone_env_template() {
  cp env/.env.template env/.env.dev
  echo "" >>  env/.env.dev
  echo "NODE_ENV=development" >>  env/.env.dev

  cp env/.env.template env/.env.test
  echo "" >>  env/.env.test
  echo "NODE_ENV=production" >>  env/.env.test

  cp env/.env.template env/.env.prod
  echo "" >>  env/.env.dev
  echo "NODE_ENV=production" >>  env/.env.prod
}

grant_permissions() {
  chmod -R +x ./scripts
  chmod +x ./services/app/scripts/test.sh
  chmod +x ./services/api/scripts/test.sh
}

initial_install() {
  docker-compose \
    -f docker/docker-compose.dev.yml \
    build
}

up() {
  environment="$1"
  shift;
  services="$@"
  if [[ ${environment} == "prod" || ${environment} == "dev" ]]; then
    docker-compose \
      -f docker/docker-compose.${environment}.yml \
      up $services
  elif [[ ${environment} == "unit" ]]; then
    docker-compose \
      -f docker/docker-compose.prod.yml \
      -f docker/docker-compose.${environment}.yml \
      up --exit-code-from $services
  fi
}

down() {
  environment="$1"
  shift;
  services="$@"
  docker-compose \
    -f docker/docker-compose.${environment}.yml \
    down $services
}

function install() {
  environment="$1"
  shift;
  services="$@"
  docker-compose \
    -f docker/docker-compose.${environment}.yml \
    build $services
}

function uninstall() {
  environment="$1"
  shift;
  services="$@"
  if [ -z "$services" ]
  then
      docker-compose \
        -f docker/docker-compose.${environment}.yml \
        down --rmi all
  else
    for service in $services
    do
      docker rmi "$service-image-$environment"
    done
  fi
}

function nuke() {
  docker system prune
}

command=$1
environment=$2
shift;
shift;
services=$@

case $command in
   bootstrap)
        grant_permissions
        clone_env_template
        initial_install
        ;;
    grant)
        grant_permissions
        ;;
    env)
        clone_env_template
        ;;
    up)
        up $environment $services
        ;;
    down)
        down $environment $services
        ;;
    install)
        install $environment $services
        ;;
    uninstall)
        uninstall $environment $services
        ;;
    nuke)
        nuke
        ;;
    *)
        echo "Option not recognized."
        exit 1
esac
