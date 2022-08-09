import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const inputedValues = text.split(' ').filter((r) => !!r);
    if (values.toString() !== inputedValues.toString()) {
      onSelectItems(
        itemName,
        text.split(' ').filter((r) => !!r)
      );
    }
  }, [text]);

  useEffect(() => {
    const inputedValues = text.split(' ').filter((r) => !!r);
    if (values.toString() !== inputedValues.toString()) {
      setText(values.join(' '));
    }
  }, [values]);

  return (
    <div className="text-search">
      <input
        className="text"
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
});
