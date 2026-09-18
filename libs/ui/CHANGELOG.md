# Changelog

All notable changes to `gd-design-library` are documented in this file.

## [1.9.1] - 2026-09-18

This release summarizes the relevant changes after `v1.8.3` in the
[`cto-rnd-system-design`](https://github.com/griddynamics/cto-rnd-system-design)
repository, from which GridKit was extracted.

### Changed

- **Standalone distribution**: `gd-design-library`, the Form Configurator packages,
  and Storybook now live in the standalone GridKit repository. Applications consume
  the published library rather than its source from the former monorepo.
- **Renderer entry point**: A2UI consumers now import `renderA2UISpec` from
  `gd-design-library/renderer`.

### Fixed

- **Consumer build resolution**: removed obsolete monorepo aliases and added the
  JSON-schema type declaration required for consumers to resolve the published
  package correctly.
- **Application integration**: updated applications to depend on
  `gd-design-library` v1.8.3 or later after the repository separation.
