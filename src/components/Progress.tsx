const Progress = ({ percent }: { percent: number }) => {
  return (
    <div className=' h-5 w-full rounded-lg bg-backgound'>
      <div
        className='h-5 rounded-lg bg-green p-0.5 text-center text-xs font-medium leading-none text-blue-100'
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default Progress;
