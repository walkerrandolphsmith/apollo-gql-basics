// We have a need to store process.env into a variable because
// webpack define plugin will attempt to replace the environment varaibles
// when the docker image is being built, but the variables will not be injected
// until the docker container is stareted. This avoids storing secrets in docker images
// and prevents webpack from "removing" dead code
let proc = process;
module.exports = proc.exports;
