import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { genericMemo } from '@/utils/genericMemo';

interface Props<N extends string> {
  itemName: N;
  values: string[];
  onSelectItems: (itemName: N, searchTexts: string[]) => void;
}

export const TextSearch = genericMemo(function Component<N extends string>({
  itemName,
  values,
  onSelectItems,
}: Props<N>) {
  const [text, setText] = useState('');

  const handleTextChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value;
      setText(newText);
      const inputedValues = newText.split(' ').filter((r) => !!r);
      if (values.toString() !== inputedValues.toString()) {
        onSelectItems(
          itemName,
          newText.split(' ').filter((r) => !!r),
        );
      }
    },
    [itemName, onSelectItems, values],
  );

  useEffect(() => {
    const inputedValues = text.split(' ').filter((r) => !!r);
    if (values.toString() !== inputedValues.toString()) {
      setText(values.join(' '));
    }
  }, [text, values]);

  return (
    <div className="text-search">
      <input
        className="text"
        type="search"
        value={text}
        onChange={handleTextChanged}
      />
    </div>
  );
});
