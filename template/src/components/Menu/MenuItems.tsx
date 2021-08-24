import * as React from 'react'
import { motion, AnimateSharedLayout, Variants } from 'framer-motion'
import styled from 'styled-components'
import { Home, List, Drafts } from '@styled-icons/material'
import { NavLink } from 'react-router-dom'

interface Props {
  isCollapsed: boolean
  position: 'left' | 'right' | 'top' | 'bottom'
}

interface DisplayProps {
  direction: 'row' | 'column'
}

const MENU_WIDTH_OPEN = 180
const MENU_WIDTH_CLOSED = 24
const MENU_HEIGHT_OPEN = 48
const MENU_HEIGHT_CLOSED = 24

const textOpenClosedVariants: Variants = {
  openWidth: {
    opacity: 1,
    visibility: 'visible',
    display: 'block',

    position: 'absolute',
    left: '16px',
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

const openClosedVariants: Variants = {
  openWidth: (width = MENU_WIDTH_OPEN) => {
    return {
      width: width,
      transition: {
        ease: 'easeOut',
        duration: 0.4,
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
      maxHeight: height,
      transition: {
        ease: 'easeOut',
        duration: 0.15,
      },
    }
  },
  closedHeight: (height = MENU_HEIGHT_CLOSED) => ({
    maxHeight: height,
    transition: {
      ease: 'easeIn',
      duration: 0.2,
    },
  }),
}

const MenuList = motion(styled.ul`
  padding: ${({ theme }) => theme.unit / 2}px 0;
`)
MenuList.displayName = 'MenuList'

const MenuListItem = styled.li<DisplayProps>`
  margin-bottom: ${({ theme }) => theme.unit / 2}px;
  display: ${({ direction }) =>
    direction === 'row' ? 'block' : 'inline-block'};
  padding: ${({ theme }) => theme.unit / 2}px;
`
MenuListItem.displayName = 'MenuListItem'

const MenuButton = styled(NavLink)<DisplayProps>`
  color: ${({ theme }) => theme.font.color.menu};
  padding: 0.25rem 0;
  position: relative;
  flex-direction: ${({ direction }) => direction};
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
  position: absolute;
  white-space: nowrap;
  left: 16px;
  vertical-align: middle;
  padding-left: ${({ theme, direction }) =>
    direction === 'row' ? theme.unit : 0}px;
`)
MenuTextAnimated.displayName = 'MenuTextAnimated'

const MenuText = ({
  children,
  ...props
}: React.PropsWithChildren<DisplayProps>) => (
  <MenuTextAnimated {...props} variants={textOpenClosedVariants} layout>
    {children}
  </MenuTextAnimated>
)
MenuText.displayName = 'MenuText'

const activeMenuItemStyle = {
  backgroundColor: '#fafafa',
  fontWeight: 400,
  color: '#485fc7',
}

export default function MenuItems({ isCollapsed, position }: Props) {
  const direction: DisplayProps['direction'] =
    ['left', 'right'].indexOf(position) > -1 ? 'row' : 'column'

  return (
    <AnimateSharedLayout>
      <MenuList variants={openClosedVariants} layout>
        <MenuListItem direction={direction}>
          <MenuButton
            to="/"
            exact
            title="Forms List"
            direction={direction}
            activeStyle={activeMenuItemStyle}
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
          >
            <Drafts size={24} />
            <MenuText direction={direction}>Drafts</MenuText>
          </MenuButton>
        </MenuListItem>
      </MenuList>
    </AnimateSharedLayout>
  )
}
