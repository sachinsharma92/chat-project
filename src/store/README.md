# In-app state management and HOC helper function providers

We use zustand for global state management.

## Creating a new store file

1. When exporting a component for React context provider, make sure to export a default component and end your file name with match string 'Provider'.

> Filename

```
AuthProvider.tsx
```

> For zustand instance

```
Auth.ts
```

2. **Note:** Fill out strictly defined types for each variable and function that exists in a `zustand` instance.

## Import and usage

```tsx
import { useBotnetAuth } from '@/store/Auth';

const YourComponent = () => {
  const [userId] = useBotnetAuth(state => [state.session?.user?.id || '']);

  return <div></div>;
};

export default YourComponent;
```
