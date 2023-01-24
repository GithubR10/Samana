import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  color?: 'red' | 'grey' | 'green';
};

const Pill = ({ children, color = 'grey' }: Props) => {
  return (
    <div
      className={`rounded-full px-2 py-1 text-center text-xs ${
        color === 'grey'
          ? 'bg-[#E5E7EB] text-[#6B7280]'
          : color === 'red'
          ? 'bg-[#F56565] text-white'
          : 'bg-[#C6DDBF] text-white'
      }`}
    >
      {children}
    </div>
  );
};

export default Pill;
