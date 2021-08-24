import * as React from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

interface DisplayProps {
  align?: string
}

const MenuToggle = styled.div<DisplayProps>`
  flex: 0;
  border: none;
  display: flex;
  justify-content: ${({ align = 'left' }) => align};
  padding: 8px;
`
MenuToggle.displayName = 'MenuToggle'

export default function MenuButton(props: { onClick: any } & DisplayProps) {
  return (
    <MenuToggle {...props}>
      <svg width="23" height="23" viewBox="0 0 23 23">
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="hsl(0, 0%, 18%)"
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
          stroke="hsl(0, 0%, 18%)"
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
          stroke="hsl(0, 0%, 18%)"
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
