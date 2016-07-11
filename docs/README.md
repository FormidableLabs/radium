### Overview

The `radium-docs` [documentation site](http://formidable.com/open-source/radium-test/) source lives here in `/docs`. The `docs/**/docs.js` components are imported into `radium-docs` and deployed from there.

### Deployment

Submit a pull request to `master`, and once it's merged, `radium-docs` will need to run `update-project` and merge into `master`. A new push to `master` in `radium-docs` will trigger a deployment.
