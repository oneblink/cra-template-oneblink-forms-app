import React from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useTheme } from 'styled-components'

type Props = {
  onSwipeRight: () => void
  disabled: boolean
}

export default function SwipeContainer({
  children,
  onSwipeRight,
  disabled,
}: React.PropsWithChildren<Props>) {
  const theme = useTheme()
  const x = useMotionValue(0)
  const background = useTransform(
    x,
    [0, window.innerWidth],
    ['#00000000', theme.palette.errorRed],
  )

  const [exitAnimation, setExitAnimation] = React.useState({})
  const onDragEnd = React.useCallback(
    (event, { offset, velocity }) => {
      const swipeConfidence = offset.x * velocity.x
      if (offset > window.innerWidth / 2 || swipeConfidence > 300000) {
        setExitAnimation({ x: window.innerWidth })
        onSwipeRight()
      }
    },
    [onSwipeRight],
  )

  return (
    <React.Fragment>
      {disabled ? (
        <React.Fragment>{children}</React.Fragment>
      ) : (
        <motion.div style={{ background, width: '100%' }}>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            dragMomentum={true}
            onDragEnd={onDragEnd}
            animate={exitAnimation}
            transition={{ duration: 0.25 }}
            style={{ x }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </React.Fragment>
  )
}
