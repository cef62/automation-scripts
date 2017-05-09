#!/usr/bin/env node

const { installFlowTypeDefinitions } = require('./api/flow-typed')
const { echo, exit } = require('shelljs')

installFlowTypeDefinitions().then(() => exit(0)).catch(err => {
  echo(err)
  exit(1)
})
