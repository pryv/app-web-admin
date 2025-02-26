# Admin Panel

Web app for Pryv.io platform configuration.
Also includes management of admin panel users and their permissions.

## Contributing

### Installation

Prerequisites: [Node.js](https://nodejs.org/en/download/) 16, [just](https://github.com/casey/just#installation)

Then:
1. `just setup-dev-env`
2. `just install` to install node modules
3. `just build` for the initial Vue build

Running `just` with no argument displays the available commands (defined in `justfile`).

### Dev environment basics

The code is structured as a regular Vue 2 app, and follows the [Semi-Standard](https://github.com/standard/semistandard) style.

### Testing

```
just test [...params]
```
- Extra parameters at the end are passed on to [Mocha](https://mochajs.org/) (default settings are defined in `.mocharc.js` files)
- Replace `test` with `test-debug` to use the debugger

### Development server

```
just serve [...params]
```
Then open it specifying the config leader service with `https://l.backloop.dev:8080?pryvLeaderUrl={LEADER_URL}` (with `LEADER_URL` set for example to `https://lead.pryv.li`, or `http://localhost:7000` for a locally running service)

### Publishing to GitHub pages

```
just publish
```


## License

[BSD-3-Clause](https://github.com/pryv/app-web-admin/blob/master/LICENSE)


# License

[BSD-Clause-3](LICENSE)
