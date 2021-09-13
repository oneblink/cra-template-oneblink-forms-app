import * as React from 'react'
import { motion, Variants } from 'framer-motion'
import styled from 'styled-components'
import { Home, List, Drafts } from '@styled-icons/material'
import { NavLink } from 'react-router-dom'
import { useMenuState } from './MenuStateProvider'

interface DisplayProps {
  direction: 'row' | 'column'
}

const textOpenClosedVariants: Variants = {
  openWidth: {
    opacity: 1,
    visibility: 'visible',
    transition: {
      ease: 'linear',
      duration: 0.3,
    },
  },
  closedWidth: {
    opacity: 0,
    transition: {
      ease: 'linear',
      duration: 0.1,
    },
  },
  openHeight: {
    opacity: 1,
    visibility: 'visible',
    transition: {
      ease: 'linear',
      duration: 0.3,
    },
  },
  closedHeight: {
    opacity: 0,
    transition: {
      ease: 'linear',
      duration: 0.1,
    },
  },
}

const MenuList = motion(styled.ul`
  padding: ${({ theme }) => theme.unit / 2}px 1rem;
`)
MenuList.displayName = 'MenuList'

const MenuListItem = styled.li<DisplayProps>`
  margin-bottom: ${({ theme }) => theme.unit / 2}px;
  display: block;
`
MenuListItem.displayName = 'MenuListItem'

const MenuButton = styled(NavLink)<DisplayProps>`
  align-items: flex-end;
  color: ${({ theme }) => theme.font.color.menu};
  padding: 0.25rem 0;
  position: relative;
  flex-direction: row;
  display: flex;

  > * {
    flex: 1 1 auto;
  }

  > svg {
    flex: 0 0 auto;
  }

  &:hover {
    background-color: #fafafa;
  }
`
MenuButton.displayName = 'MenuButton'

const MenuTextAnimated = motion(styled.span<DisplayProps>`
  display: inline-block;

  white-space: nowrap;
  vertical-align: middle;
  padding-left: ${({ theme }) => theme.unit}px;
`)
MenuTextAnimated.displayName = 'MenuTextAnimated'

const MenuText = ({
  children,
  ...props
}: React.PropsWithChildren<DisplayProps>) => (
  <MenuTextAnimated {...props} variants={textOpenClosedVariants}>
    {children}
  </MenuTextAnimated>
)
MenuText.displayName = 'MenuText'

const activeMenuItemStyle = {
  backgroundColor: '#fafafa',
  fontWeight: 400,
  color: '#485fc7',
}

export default function MenuItems() {
  const { position, toggleCollapsed } = useMenuState()
  const direction: DisplayProps['direction'] =
    ['left', 'right'].indexOf(position) > -1 ? 'row' : 'column'

  const onClick = React.useCallback(() => {
    if (['top', 'bottom'].indexOf(position) > -1) {
      toggleCollapsed()
    }
  }, [position, toggleCollapsed])

  return (
    <MenuList layout>
      <MenuListItem direction={direction}>
        <MenuButton
          to="/"
          exact
          title="Forms List"
          direction={direction}
          activeStyle={activeMenuItemStyle}
          onClick={onClick}
        >
          <Home size={24} />
          <MenuText direction={direction}>Forms List</MenuText>
        </MenuButton>
      </MenuListItem>
      <MenuListItem direction={direction}>
        <MenuButton
          to="/pending"
          title="Pending Queue"
          direction={direction}
          activeStyle={activeMenuItemStyle}
          onClick={onClick}
        >
          <List size={24} />
          <MenuText direction={direction}>Pending Queue</MenuText>
        </MenuButton>
      </MenuListItem>
      <MenuListItem direction={direction}>
        <MenuButton
          to="/drafts"
          title="Drafts"
          direction={direction}
          activeStyle={activeMenuItemStyle}
          onClick={onClick}
        >
          <Drafts size={24} />
          <MenuText direction={direction}>Drafts</MenuText>
        </MenuButton>
      </MenuListItem>
    </MenuList>
  )
}
