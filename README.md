# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--bancoppel-eds-ue--javieraem94.aem.page/
- Live: https://main--bancoppel-eds-ue--javieraem94.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

This project uses [pnpm](https://pnpm.io/) as its package manager. `npm`/`yarn` installs are blocked on purpose (see the `preinstall` script in `package.json`).

```sh
pnpm install
```

## Linting

```sh
pnpm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
