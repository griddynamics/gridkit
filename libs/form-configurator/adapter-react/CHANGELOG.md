# Changelog

All notable changes to this project will be documented in this file.

## [0.0.12] - 2025-10-16

### Fixed

- **Dependency Update**: Updated `gd-form-configurator` dependency to ^0.0.9
  - Fixes missing CSS file issue in core library
  - Ensures styles are properly accessible via `import 'gd-form-configurator/styles'`

---

## [0.0.11] - 2025-10-16

### Fixed

- **Dependency Update**: Updated `gd-form-configurator` dependency to ^0.0.8
  - Fixes import resolution issues for utility functions (`parseScopePath`, `parseFieldName`, etc.)
  - Ensures compatibility with fixed core library module exports
  - Resolves "is not a function" runtime errors

---

## [0.0.10] - 2025-10-16

### Fixed

- **Dependency Update**: Updated `gd-form-configurator` dependency to ^0.0.7
  - Ensures compatibility with latest core library version
  - Fixes import issues with utility functions like `parseScopePath`

---

## [0.0.9] - 2025-10-16

### Fixed

- **Critical Build Fix**: Removed `@griddynamics/ui` from external dependencies
  - Package now bundles UI components instead of requiring them as external dependency
  - Fixes "Module not found: Can't resolve '@griddynamics/ui'" error in published package
  - Users no longer need access to Grid Dynamics UI library to use this package

---

## [0.0.8] - 2025-01-16

### Fixed

- **Critical**: Fixed build error when `@griddynamics/ui` is not installed
  - Removed hard dependency on Grid Dynamics UI logger integration
  - Made logger prop the primary way to enable logging
  - Package now works standalone without requiring `@griddynamics/ui`

---

## [0.0.7] - 2025-01-16

### Added

- **Logger Integration**: Full support for logging throughout React components
  - Automatic integration with Grid Dynamics UI `LoggerProvider`
  - Custom logger prop support on `FormBuilder`
  - Silent operation when no logger is provided
  - Enhanced debugging capabilities for form state and rendering

### Improvements

- **Styles Optimization**: Improved styling system for better performance
  - Optimized component styling with better CSS organization
  - Reduced style recalculation overhead
  - Enhanced theme integration
- **Bundle Optimization**: Reduced package size and improved tree-shaking
  - Better code splitting for optimal loading
  - Optimized peer dependencies handling
  - Improved build configuration

### Fixes

- Minor bug fixes in control rendering
- Improved error boundary handling
- Fixed edge cases in custom control registration
- Enhanced TypeScript type definitions

---

## [0.0.6] - Previous Release

Initial public release with React adapter:

- Pre-built React components for all control types
- Grid Dynamics UI integration
- Custom controls support
- Hooks API (useFormEngine, useFormStore)
- Full TypeScript support
