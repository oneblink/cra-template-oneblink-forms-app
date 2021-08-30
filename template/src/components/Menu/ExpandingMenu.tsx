import * as React from 'react'
import { motion, useCycle } from 'framer-motion'
import useViewportSizes from 'use-viewport-sizes'

import MenuToggle from './MenuToggle'
import MenuItems from './MenuItems'
import useDimensions from 'hooks/useDimensions'
import styled from 'styled-components'

// for now, top and bottom give weird results
interface Props {
  position: 'left' | 'right' | 'top' | 'bottom'
}

const MenuContainer = motion(styled.div<Props>`
  display: flex;
  flex: 1;
  flex-direction: ${({ position }) =>
    ['left', 'right'].indexOf(position) > -1 ? 'column' : 'row'};
  padding: 0 0.25rem;
`)
MenuContainer.displayName = 'MenuContainer'

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
      </MenuHeader>
      <MenuItems isCollapsed={isCollapsed} position={position} />
    </MenuContainer>
  )
}
