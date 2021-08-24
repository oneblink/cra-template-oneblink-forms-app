import * as React from 'react'
import { motion, useCycle, Variants } from 'framer-motion'
import useViewportSizes from 'use-viewport-sizes'

import MenuToggle from './MenuToggle'
import MenuItems from './MenuItems'
import useDimensions from 'hooks/useDimensions'
import styled from 'styled-components'

// for now, top and bottom give weird results
interface Props {
  position: 'left' | 'right' | 'top' | 'bottom'
}

const textOpenClosedVariants: Variants = {
  openWidth: {
    opacity: 1,
    visibility: 'visible',
    display: 'block',

    transition: {
      ease: 'linear',
      duration: 0.3,
    },
  },
  closedWidth: {
    opacity: 0,
    transitionEnd: { display: 'none' },
    transition: {
      ease: 'linear',
      duration: 0.1,
    },
  },
  openHeight: {
    opacity: 1,
    visibility: 'visible',
    position: 'relative',
    transition: {
      ease: 'linear',
      duration: 0.3,
    },
  },
  closedHeight: {
    opacity: 0,
    position: 'absolute',
    transition: {
      ease: 'linear',
      duration: 0.1,
    },
  },
}

const MenuContainer = motion(styled.div<Props>`
  display: flex;
  flex: 1;
  flex-direction: ${({ position }) =>
    ['left', 'right'].indexOf(position) > -1 ? 'column' : 'row'};
  padding: 0 0.25rem;
`)
MenuContainer.displayName = 'MenuContainer'

const MenuTextAnimated = motion(styled.span`
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  flex: 1;
  padding: ${({ theme }) => theme.unit / 2}px;
  margin-top: -3px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`)
MenuTextAnimated.displayName = 'MenuTextAnimated'

const MenuText = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <MenuTextAnimated {...props} variants={textOpenClosedVariants} layout>
    {children}
  </MenuTextAnimated>
)
MenuText.displayName = 'MenuText'

const MenuHeader = styled.div`
  display: flex;
  flex-direction: row;
`

export default function Menu({ position }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { width, height } = useDimensions(containerRef)
  // @ts-expect-error
  const [vpWidth] = useViewportSizes({ throttleTimeout: 1000 })
  const [isCollapsed, toggleExpanded] = useCycle(false, true)

  React.useEffect(() => {
    if (vpWidth <= 480 && vpWidth && !isCollapsed) {
      toggleExpanded()
    }
  }, [isCollapsed, toggleExpanded, vpWidth])

  const customAnimationValue =
    ['left', 'right'].indexOf(position) > -1 ? width : height

  let animation, menuToggleAlign
  if (isCollapsed) {
    if (['left', 'right'].indexOf(position) > -1) {
      menuToggleAlign = position === 'left' ? 'flex-start' : 'flex-end'
      animation = 'closedWidth'
    } else {
      animation = 'closedHeight'
      menuToggleAlign = position === 'top' ? 'flex-start' : 'flex-end'
    }
  } else {
    if (['left', 'right'].indexOf(position) > -1) {
      animation = 'openWidth'
      menuToggleAlign = position === 'left' ? 'flex-start' : 'flex-end'
    } else {
      animation = 'openHeight'
      menuToggleAlign = position === 'top' ? 'flex-start' : 'flex-end'
    }
  }
  return (
    <MenuContainer
      animate={animation}
      initial={'openWidth'}
      custom={customAnimationValue}
      ref={containerRef}
      position={position}
    >
      <MenuHeader>
        <MenuToggle onClick={toggleExpanded} align={menuToggleAlign} />
        <MenuText>OneBlink Forms</MenuText>
      </MenuHeader>
      <MenuItems isCollapsed={isCollapsed} position={position} />
    </MenuContainer>
  )
}
