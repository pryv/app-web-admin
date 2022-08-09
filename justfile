# add node bin script path for recipes
export PATH := "./node_modules/.bin:" + env_var('PATH')

# Default: display available recipes
_help:
    @just --list

# –––––––––––––----------------------------------------------------------------
# Setup
# –––––––––––––----------------------------------------------------------------

# Set up the dev environment on a MacOS or GNU/Linux system
setup-dev-env:
    scripts/setup-dev-env

# Install node modules
install *params:
    npm install {{params}}

# Compile code to `dist/`
build *params:
    vue-cli-service build {{params}}

# –––––––––––––----------------------------------------------------------------
# Test & related
# –––––––––––––----------------------------------------------------------------

# Run code linting
lint *params:
    vue-cli-service lint {{params}}

# Run tests with optional extra parameters
test *params:
    NODE_ENV=test vue-cli-service test:unit --require tests/unit/helpers/setup.js {{params}}

# Run tests for debugging
test-debug *params:
    NODE_ENV=test vue-cli-service test:unit --require tests/unit/helpers/setup.js --timeout 3600000 --inspect-brk=40000 {{params}}

# Start a `rec.la` web server on `dist/`
serve *params:
    vue-cli-service serve {{params}}

# –––––––––––––----------------------------------------------------------------
# Misc. utils
# –––––––––––––----------------------------------------------------------------

# Run source licensing tool
license:
    source-licenser --config-file .licenser.yml ./

# Publish `dist` to GitHub pages
publish:
    #!/usr/bin/env node
    const ghpages = require('gh-pages');
    ghpages.publish('dist', function(err) {
        console.log(error);
    });
