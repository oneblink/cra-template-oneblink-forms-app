import * as React from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { useMenuState } from 'components/Menu/MenuStateProvider'

const MenuToggle = motion(styled.div`
  flex: 0;
  border: none;
  display: flex;
  padding: 8px 8px 0;
`)
MenuToggle.displayName = 'MenuToggle'

export default function MenuButton() {
  const { toggleCollapsed, animation, startingAnimation } = useMenuState()

  return (
    <MenuToggle
      onClick={toggleCollapsed}
      initial={startingAnimation}
      animate={animation}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="hsl(100, 100%, 100%)"
          strokeLinecap="round"
          variants={{
            closedWidth: { d: 'M 2 2.5 L 20 2.5' },
            openWidth: { d: 'M 3 16.5 L 17 2.5' },
            closedHeight: { d: 'M 2 2.5 L 20 2.5' },
            openHeight: { d: 'M 3 16.5 L 17 2.5' },
          }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="hsl(100, 100%, 100%)"
          strokeLinecap="round"
          d="M 2 9.423 L 20 9.423"
          variants={{
            closedWidth: { opacity: 1 },
            openWidth: { opacity: 0 },
            closedHeight: { opacity: 1 },
            openHeight: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="hsl(100, 100%, 100%)"
          strokeLinecap="round"
          variants={{
            closedWidth: { d: 'M 2 16.346 L 20 16.346' },
            openWidth: { d: 'M 3 2.5 L 17 16.346' },
            closedHeight: { d: 'M 2 16.346 L 20 16.346' },
            openHeight: { d: 'M 3 2.5 L 17 16.346' },
          }}
        />
      </svg>
    </MenuToggle>
  )
}
