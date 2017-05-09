#!/usr/bin/env node

const { createComponent } = require('./api/create-component')
const { echo, exit } = require('shelljs')
const {
  action,
  target,
} = require('yargs').option('a', {
  alias: 'action',
  demand: true,
  default: 'create',
  requiresArg: true,
  describe: 'Type of action to execute',
  choices: ['create'],
  type: 'string'
}).argv

const actions = new Map([
  ['create', () => createComponent()],
])

if (!actions.has(action)) {
  echo(`The given action: [${action}] is not valid, see usage help.`)
  exit(1)
} else {
  actions.get(action)(target)
    .then(() => exit(0))
    .catch((err) => {
      echo(err)
      exit(1)
    })
}
