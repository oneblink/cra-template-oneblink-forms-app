import * as React from 'react'
import { AnimateSharedLayout, motion, Variants } from 'framer-motion'

import MenuItems from './MenuItems'
import { useMenuState } from 'components/Menu/MenuStateProvider'
import styled from 'styled-components'

// for now, top and bottom give weird results
interface Props {
  position: 'left' | 'right' | 'top' | 'bottom'
}

const MENU_WIDTH_OPEN = 200
const MENU_WIDTH_CLOSED = 0
const MENU_HEIGHT_OPEN = 148
const MENU_HEIGHT_CLOSED = 0

const MenuContainer = motion(styled.div<Props>`
  display: flex;
  flex: 1;
  flex-direction: ${({ position }) =>
    ['left', 'right'].indexOf(position) > -1 ? 'column' : 'row'};
  overflow: hidden;
  height: 0px;
  width: 0px;
`)
MenuContainer.displayName = 'MenuContainer'

const openClosedVariants: Variants = {
  openWidth: (width = MENU_WIDTH_OPEN) => {
    return {
      width: width,
      height: 'auto',
      transition: {
        ease: 'easeOut',
        duration: 0.15,
      },
    }
  },
  closedWidth: (width = MENU_WIDTH_CLOSED) => ({
    width: width,

    transition: {
      ease: 'easeIn',
      duration: 0.2,
    },
  }),
  openHeight: (height = MENU_HEIGHT_OPEN) => {
    return {
      height: height,
      transition: {
        ease: 'easeOut',
        duration: 0.15,
      },
    }
  },
  closedHeight: (height = MENU_HEIGHT_CLOSED) => ({
    height: height,
    transition: {
      ease: 'easeIn',
      duration: 0.2,
    },
  }),
}

export default function Menu() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { position, animation, startingAnimation } = useMenuState()

  return (
    <AnimateSharedLayout>
      <MenuContainer
        animate={animation}
        initial={startingAnimation}
        ref={containerRef}
        position={position}
        variants={openClosedVariants}
      >
        <MenuItems />
      </MenuContainer>
    </AnimateSharedLayout>
  )
}
