export const Avatar = ({ name }: { name: string }) => (
  <div class='grid h-[2rem] w-[2rem] cursor-pointer place-items-center rounded-full bg-accent shadow-sm'>
    <p class='m0 text-center text-white font-medium tracking-wider'>
      {name.slice(0, 2).toUpperCase()}
    </p>
  </div>
)
