import React, { FC, useEffect, useRef } from 'react'
import Link from 'next/link'
import { WeekDayProps, mainDays } from './data'
import { cn } from 'ui'
import { isBrowser } from 'common'

import SectionContainer from '~/components/Layouts/SectionContainer'
import useConfData from '../../hooks/use-conf-data'
import Image from 'next/image'

const LWXStickyNav: FC = () => {
  const days = mainDays()
  const { ticketState, userData } = useConfData()
  const hasPlatinumTicket = userData.platinum
  const hasSecretTicket = userData.secret
  const hasTicket = ticketState === 'ticket'
  const USER = userData?.name || userData?.username
  const DISPLAY_NAME = USER && USER.split(' ')[0]

  const OFFSET = 66
  const anchors = useRef<NodeListOf<HTMLHeadingElement> | null>(null)
  const links = useRef<NodeListOf<HTMLHeadingElement> | null>(null)

  const handleScroll = () => {
    let newActiveAnchor: string = ''

    anchors.current?.forEach((anchor) => {
      const { y: offsetFromTop } = anchor.getBoundingClientRect()

      if (offsetFromTop - OFFSET < 0) {
        newActiveAnchor = anchor.id
      }
    })

    links.current?.forEach((link) => {
      link.classList.remove('!text-foreground')

      const sanitizedHref = decodeURI(link.getAttribute('href') ?? '')
        .split('#')
        .splice(-1)
        .join('')
      const isMatch = sanitizedHref === newActiveAnchor

      if (isMatch) {
        link.classList.add('!text-foreground')
      }
    })
  }

  useEffect(() => {
    if (!isBrowser) return
    anchors.current = document.querySelectorAll('.lw-nav-anchor')
    links.current = document.querySelectorAll('.lw-sticky-nav li a')

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function getTicketIcon() {
    const getImgPath = (type: string) =>
      `/images/launchweek/11/tickets/icon/ticket-icon-${type}.png`

    if (hasSecretTicket) return getImgPath('secret')
    if (hasPlatinumTicket) return getImgPath('platinum')
    return getImgPath('regular')
  }

  return (
    <div className="absolute inset-0 pointer-events-none w-full h-full">
      <nav className="sticky z-30 top-0 bg-default/90 backdrop-blur-sm pointer-events-auto w-full border-b dark:border-muted h-[60px] flex items-center">
        <SectionContainer className="!max-w-none !py-0 lg:!container flex items-center justify-between font-mono gap-4 md:gap-8 text-sm">
          <div className="w-full flex items-center gap-4 md:gap-8">
            <ul className="w-full lw-sticky-nav flex items-center gap-2 md:gap-4 text-foreground-muted">
              {days.map((day: WeekDayProps) => (
                <li key={day.id}>
                  <Link
                    href={`#${day.id}`}
                    className={cn(
                      'p-1 transition-colors hover:text-foreground flex items-center',
                      day.isToday && 'text-foreground-light'
                    )}
                  >
                    {day.dd}{' '}
                    {day.isToday && (
                      <span
                        title="Live"
                        className="w-1 h-1 ml-1 animate-pulse rounded-full bg-brand mb-2 block"
                      />
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="#build-stage" className="p-1 transition-colors hover:text-foreground">
                  Build Stage
                </Link>
              </li>
              <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
                <li>
                  <Link href="#meetups" className="p-1 transition-colors hover:text-foreground">
                    Meetups
                  </Link>
                </li>
                <li className="hidden sm:block">
                  <Link href="#ticket" className="p-1 transition-colors hover:text-foreground">
                    Ticket
                  </Link>
                </li>
              </div>
            </ul>
          </div>
        </SectionContainer>
      </nav>
    </div>
  )
}

export default LWXStickyNav
