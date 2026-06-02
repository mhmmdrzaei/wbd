import {PortableText} from '@portabletext/react';

type Props = {
  value: unknown[] | undefined;
};

export function RichText({value}: Props) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="rich-text">
      <PortableText value={value} />
    </div>
  );
}
