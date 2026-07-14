# Changelog

All notable changes to this project will be documented in this file.

## [0.0.9] - 2025-10-16

### Fixed

- **Critical Build Fix**: Fixed CSS file not being included in published package
  - Updated Vite config to properly copy `general.css` as `index.css`
  - CSS file now accessible via `import 'gd-form-configurator/styles'`
  - Fixed nxCopyAssetsPlugin configuration with correct relative paths

---

## [0.0.8] - 2025-10-16

### Fixed

- **Critical Build Fix**: Removed CSS side-effect import from entry point
  - Fixes module resolution issues when using `preserveModules` in Vite
  - Resolves "is not a function" errors for exported utilities like `parseScopePath`
  - CSS must now be imported explicitly via `import 'gd-form-configurator/styles'`
  - Improves compatibility with various bundlers (Webpack, Vite, Rollup)

---

## [0.0.7] - 2025-01-16

### Added

- **Logger System**: Integrated optional logging system with `ILogger` interface support
  - Added `ConsoleLogger` implementation for development
  - Added `NoOpLogger` for silent operation (default)
  - Support for custom logger implementations (Winston, Pino, etc.)
  - Comprehensive logging throughout FormEngine lifecycle (debug, info, warn, error levels)

### Improvements

- **Styles Optimization**: Refactored CSS classes and improved styling performance
  - Optimized class naming conventions
  - Reduced CSS specificity conflicts
  - Better organization of style modules
- **Bundle Optimization**: Enhanced build configuration for smaller bundle sizes
  - Improved tree-shaking capabilities
  - Optimized external dependencies
  - Better code splitting

### Fixes

- Minor bug fixes and stability improvements
- Improved error handling in form validation
- Fixed edge cases in array item operations

---

## [0.0.6] - Previous Release

Initial public release with core functionality:

- Schema-driven form management
- AJV validation
- Conditional logic (SHOW/HIDE/ENABLE/DISABLE)
- Dynamic schema updates
- Array support with add/remove/move operations
- Framework-agnostic core
