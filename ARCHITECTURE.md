# Architecture & Design Guidelines

## Project Structure

```text
src/app/
├── core/
│   ├── session/
│   ├── http/ (*.interceptor.ts)
│   ├── guards/
│   ├── errors/
│   ├── notification/
│   └── domains/<domainName>/
│       ├── <domainName>.model.ts
│       ├── <domainName>.service.ts
│       ├── <domainName>.api.ts
│       └── <domainName>.store.ts
├── shared/
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   └── tools/
└── features/
    └── <domainName>/
        ├── components/
        ├── <domainName>.ts
        ├── <domainName>.html
        └── <domainName>.css
```

## Folder Responsibilities

### core/
Contains singleton services, guards, interceptors, and domain-specific business logic that should be imported only once in the application.

- **session/** - Authentication and user session management
- **http/** - HTTP interceptors for request/response handling
- **guards/** - Route guards for access control
- **errors/** - Global error handling services
- **notification/** - Application-wide notification system
- **domains/<domainName>/** - Domain-driven design modules containing:
  - **model.ts** - Domain entities and interfaces
  - **service.ts** - Business logic and orchestration
  - **api.ts** - HTTP calls and backend communication
  - **store.ts** - State management (signals or NgRx)

### shared/
Contains reusable components, directives, pipes, and utilities used across multiple features.

- **components/** - Dumb/presentational components
- **directives/** - Custom attribute and structural directives
- **pipes/** - Custom transformation pipes
- **tools/** - Utility functions and helpers

### features/
Contains feature modules organized by domain. Each feature is self-contained and lazy-loadable.

- **<domainName>/** - Feature-specific components and logic
  - **components/** - Feature-specific components
  - **<domainName>.ts** - Main feature component class
  - **<domainName>.html** - Main feature template
  - **<domainName>.css** - Main feature styles

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Component | `<name>.ts` | `schedule.ts` |
| Template | `<name>.html` | `schedule.html` |
| Styles | `<name>.css` | `schedule.css` |
| Service | `<name>.service.ts` | `schedule.service.ts` |
| API Service | `<name>.api.ts` | `schedule.api.ts` |
| Store | `<name>.store.ts` | `schedule.store.ts` |
| Model/Interface | `<name>.model.ts` or `<name>.ts` | `schedule.model.ts` or `schedule-item.ts` |
| Guard | `<name>.guard.ts` | `auth.guard.ts` |
| Interceptor | `<name>.interceptor.ts` | `auth.interceptor.ts` |
| Pipe | `<name>.pipe.ts` | `duration.pipe.ts` |
| Directive | `<name>.directive.ts` | `highlight.directive.ts` |

### Classes and Interfaces

| Type | Pattern | Example |
|------|---------|---------|
| Component | `PascalCase` | `ScheduleComponent` |
| Service | `PascalCase + Service` | `ScheduleService` |
| API Service | `PascalCase + Api` | `ScheduleApi` |
| Store | `PascalCase + Store` | `ScheduleStore` |
| Guard | `PascalCase + Guard` | `AuthGuard` |
| Interceptor | `PascalCase + Interceptor` | `AuthInterceptor` |
| Pipe | `PascalCase + Pipe` | `DurationPipe` |
| Directive | `PascalCase + Directive` | `HighlightDirective` |
| Interface | `PascalCase` | `ScheduleItem`, `User` |
| Type Alias | `PascalCase` | `ScheduleFilter` |
| Enum | `PascalCase` | `UserRole`, `DayOfWeek` |

### Variables and Constants

| Type | Pattern | Example |
|------|---------|---------|
| Variables | `camelCase` | `scheduleItems`, `currentUser` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRY_COUNT` |
| Private fields | `camelCase` (no underscore prefix) | `items`, `isLoading` |
| Signals | `camelCase` | `scheduleItems = signal([])` |
| Observables | `camelCase$` (with $ suffix) | `scheduleItems$`, `user$` |

### Functions and Methods

| Type | Pattern | Example |
|------|---------|---------|
| Public methods | `camelCase` | `getSchedule()`, `updateItem()` |
| Private methods | `camelCase` (no underscore prefix) | `processData()`, `validateInput()` |
| Boolean methods | `is/has/can + PascalCase` | `isValid()`, `hasPermission()` |
| Event handlers | `on + PascalCase` | `onClick()`, `onSubmit()` |

## Best Practices

### Component Design
- Keep components focused on a single responsibility
- Use standalone components by default
- Prefer signals over traditional state management for simple cases
- Keep templates simple; move complex logic to component class or services
- Use OnPush change detection strategy when possible
- Avoid direct DOM manipulation; use Angular APIs

### State Management
- Use signals for local component state
- Use stores (in core/domains) for shared state across features
- Keep stores domain-specific and focused
- Expose state as readonly signals
- Update state through service methods, not directly

### Services
- Injectable services should be provided in 'root' unless feature-specific
- Keep services focused on a single domain
- Use dependency injection over static methods
- API services should only handle HTTP calls
- Business logic belongs in service files, not API files

### Type Safety
- Always define explicit return types for functions
- Use interfaces for data structures
- Avoid 'any' type; prefer 'unknown' when type is truly unknown
- Use strict TypeScript configuration
- Define DTOs for API request/response payloads

### Performance
- Use trackBy functions in *ngFor loops
- Lazy load feature modules
- Implement virtual scrolling for long lists
- Unsubscribe from observables in ngOnDestroy
- Use async pipe when possible to auto-unsubscribe

### Testing
- Write unit tests for services and business logic
- Test components with standalone configuration
- Mock dependencies using Angular testing utilities
- Aim for high coverage on critical business logic
- Use meaningful test descriptions

### Error Handling
- Handle errors at the appropriate level
- Use global error handler for unexpected errors
- Provide user-friendly error messages
- Log errors for debugging
- Implement retry logic for transient failures

## Path Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

## Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Maximum line length: 120 characters
- Use trailing commas in multi-line objects and arrays
- One component/service per file
- Extract magic numbers to named constants

## Git Commit Convention

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example: `feat(schedule): add weekly view component`
