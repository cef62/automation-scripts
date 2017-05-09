#!/usr/bin/env node

const { createComponent } = require('./api/create-component')
const { echo, exit } = require('shelljs')
const {
  name,
  stateless,
} = require('yargs').option('n', {
  alias: 'name',
  demand: true,
  requiresArg: true,
  describe: 'Name of the component to create',
  type: 'string'
}).option('s', {
  alias: 'stateless',
  demand: false,
  describe: 'Create a stateless Component',
  type: 'boolean'
})
.argv

try {
  createComponent(name, stateless)
  exit(0)
} catch (err) {
  echo(err)
  exit(1)
}
