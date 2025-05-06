type PageHeadingProps = {
  title: string;
  description: string;
};
export function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <div className='flex flex-col gap-2'>
      <h1 className='text-2xl font-bold'>{title}</h1>
      <p className='text-muted-foreground text-sm'>{description}</p>
    </div>
  );
}
