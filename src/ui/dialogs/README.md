# All things dialogs, also known as modals

This folder we keep all dialog components covered by the app.

## How to add new dialog types:

1. Create a new `React` component inside `src/ui/dialogs` folder
2. Create a new enum type using `DialogEnums` declaration from file `src/types/dialog.ts`

## Toggle your new dialog from click events:

```ts
import { useAppStore } from '@/store/Spaces';
import { DialogEnums } from '@/types/dialog';

const Button = () => {
  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);

  return (
    <button
      onClick={() => {
        setShowDialog(true, DialogEnums.YourDialogTypeHere);
      }}
    ></button>
  );
};
```
