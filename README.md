# Expo Clean Architecture Template

A production-ready Expo template following Domain-Driven Design (DDD) and Clean Architecture principles with functional programming patterns.

## 🏗️ Architecture

This template implements a clean, layered architecture:

### Domain Layer (`src/domain/`)
- **Entities**: Core business objects with pure functions
- **Repositories**: Interfaces defining data access contracts
- **Use Cases**: Business logic encapsulated in pure functions

### Infrastructure Layer (`src/infrastructure/`)
- **Repositories**: Concrete implementations of domain interfaces
- **Storage**: MMKV-based storage utilities
- **DI Container**: Dependency injection using functional composition

### Presentation Layer (`src/presentation/`)
- **Components**: Reusable UI components with animations
- **Forms**: React Hook Form with Zod validation
- **Hooks**: React Query hooks for server state
- **Store**: Zustand for client state with MMKV persistence

## 🛠️ Tech Stack

- **Framework**: Expo with React Native
- **State Management**: Zustand + MMKV persistence
- **Server State**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Storage**: MMKV for high-performance local storage
- **Animations**: React Native Reanimated
- **UI Components**: NativeUI (to be configured)
- **Styling**: NativeWind (Tailwind CSS for React Native)

## 🔧 Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── domain/
│   ├── entities/          # Business entities with pure functions
│   ├── repositories/      # Repository interfaces
│   └── useCases/         # Business logic use cases
├── infrastructure/
│   ├── repositories/     # Repository implementations
│   ├── storage/         # MMKV storage utilities
│   └── di/             # Dependency injection container
├── presentation/
│   ├── components/      # Reusable UI components
│   ├── forms/          # Form components with validation
│   ├── hooks/          # React Query hooks
│   ├── store/          # Zustand stores
│   └── providers/      # React providers
└── shared/
    ├── types/          # Shared TypeScript types
    └── utils/          # Utility functions
```

## 🎯 Key Features

- **Functional Programming**: Pure functions, immutability, composition
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Performance**: MMKV storage, React Query caching, Reanimated animations
- **Developer Experience**: Clean architecture, dependency injection, error boundaries
- **Production Ready**: Error handling, loading states, responsive design

## 🧪 Development

The template includes:
- Mock repositories for development
- Example entities (User, Todo)
- Form validation examples
- State management patterns
- Animation examples
- Error boundary implementation

## 📚 Next Steps

1. Configure NativeUI components following their documentation
2. Replace mock repositories with real API implementations
3. Add authentication flow
4. Implement additional features based on your requirements