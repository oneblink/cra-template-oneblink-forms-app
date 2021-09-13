import * as React from 'react'
import styled from 'styled-components'
import Menu from './ExpandingMenu'
import { useMenuState } from './MenuStateProvider'

interface Props {
  position?: 'left' | 'right' | 'top' | 'bottom'
}

interface ContainerProps {
  menuPosition: NonNullable<Props['position']>
}

const MENU_HEIGHT = '3rem'

const ContentContainer = styled.div<ContainerProps>`
  display: flex;
  flex: 1;
  flex-direction: ${({ menuPosition }) => {
    return {
      left: 'row',
      right: 'row-reverse',
      top: 'column',
      bottom: 'column-reverse',
    }[menuPosition]
  }};
`

const NavContainer = styled.div<Props>`
  display: flex;
  flex: 0 1 auto;
  top: ${({ position = 'left' }) =>
    ['left', 'top', 'right'].indexOf(position) > -1 ? 0 : 'initial'};
  bottom: ${({ position = 'left' }) => (position === 'bottom' ? 0 : 'initial')};
  position: ${({ position = 'left' }) =>
    ['left', 'right'].indexOf(position) > -1 ? 'initial' : 'initial'};

  min-width: ${({ position = 'left' }) => {
    return {
      left: 'auto',
      right: 'auto',
      top: '100%',
      bottom: '100%',
    }[position]
  }};
  min-height: ${({ position = 'left' }) => {
    return {
      left: '100%',
      right: '100%',
      top: 'auto',
      bottom: 'auto',
    }[position]
  }};

  background-color: ${({ theme }) => theme.palette.panelBackground};
  box-shadow: 0 1px 5px 0 rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    0 3px 1px -2px rgb(0 0 0 / 12%);
`

const PageContainer = styled.div<ContainerProps>`
  display: flex;
  flex: 1;
  flex-direction: column;

  margin-top: 0;
  margin-bottom: ${({ menuPosition }) =>
    menuPosition === 'bottom' ? `calc(${MENU_HEIGHT} + 1rem)` : '1rem'};
`

export default function PageWithMenu({
  children,
}: React.PropsWithChildren<Record<string, unknown>>) {
  const { position } = useMenuState()
  return (
    <ContentContainer menuPosition={position}>
      <NavContainer position={position}>
        <Menu />
      </NavContainer>
      <PageContainer menuPosition={position}>{children}</PageContainer>
    </ContentContainer>
  )
}
