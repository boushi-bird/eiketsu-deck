import { useEffect, useState } from 'react';

import { genericMemo } from '@/utils/genericMemo';

interface Props<N extends string> {
  itemName: N;
  onSelectItems: (itemName: N, searchTexts: string[]) => void;
}

export const TextSearch = genericMemo(function Component<N extends string>({
  itemName,
  onSelectItems,
}: Props<N>) {
  const [text, setText] = useState('');

  useEffect(() => {
    onSelectItems(
      itemName,
      text.split(' ').filter((r) => !!r)
    );
  }, [text]);

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
