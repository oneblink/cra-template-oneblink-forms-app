import * as React from 'react'
import { useCycle } from 'framer-motion'

interface Props {
  position: 'left' | 'right' | 'top' | 'bottom'
}
interface IMenuStateContext {
  position: 'left' | 'right' | 'top' | 'bottom'
  animation: 'openWidth' | 'closedWidth' | 'openHeight' | 'closedHeight'
  startingAnimation: 'openWidth' | 'closedWidth' | 'openHeight' | 'closedHeight'
  isCollapsed: boolean
  toggleCollapsed: () => void
}
const MenuStateContext = React.createContext<IMenuStateContext>({
  position: 'left',
  animation: 'openWidth',
  startingAnimation: 'openWidth',
  isCollapsed: false,
  toggleCollapsed: () => undefined,
})

export const useMenuState = () => {
  return React.useContext(MenuStateContext)
}

const animationName = (isCollapsed: boolean, position: string) => {
  if (isCollapsed) {
    if (['left', 'right'].indexOf(position) > -1) {
      return 'closedWidth'
    } else {
      return 'closedHeight'
    }
  } else {
    if (['left', 'right'].indexOf(position) > -1) {
      return 'openWidth'
    } else {
      return 'openHeight'
    }
  }
}

const startCollapsed = (position: Props['position']) =>
  position === 'top' || position === 'bottom'

export default function MenuStateProvider({
  position,
  children,
}: React.PropsWithChildren<Props>) {
  const [isCollapsed, toggleCollapsed] = useCycle(
    startCollapsed(position),
    !startCollapsed(position),
  )
  const [startingAnimation] = React.useState<
    IMenuStateContext['startingAnimation']
  >(animationName(isCollapsed, position))
  const [animation, setAnimation] = React.useState<
    IMenuStateContext['animation']
  >(animationName(isCollapsed, position))

  React.useEffect(() => {
    setAnimation(animationName(isCollapsed, position))
  }, [isCollapsed, position])

  return (
    <MenuStateContext.Provider
      value={{
        position,
        isCollapsed,
        animation,
        startingAnimation,
        toggleCollapsed,
      }}
    >
      {children}
    </MenuStateContext.Provider>
  )
}
