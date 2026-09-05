import type { ComponentProps, FC } from 'react'

export const HomePage: FC<ComponentProps<'div'>> = () => {
  return (
    <div className="container">
      <h1>Home</h1>
    </div>
  )
}
