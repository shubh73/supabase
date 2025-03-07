import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { useWindowSize } from 'react-use'

import { Announcement, Button, buttonVariants, cn } from 'ui'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from 'ui/src/components/shadcn/ui/navigation-menu'
import { useIsLoggedIn, useIsUserLoading } from 'common'
import ScrollProgress from '~/components/ScrollProgress'
import GitHubButton from './GitHubButton'
import HamburgerButton from './HamburgerMenu'
import MobileMenu from './MobileMenu'
import MenuItem from './MenuItem'
import { menu } from '~/data/nav'
import RightClickBrandLogo from './RightClickBrandLogo'
import LW12CountdownBanner from 'ui/src/layout/banners/LW12CountdownBanner/LW12CountdownBanner'

interface Props {
  hideNavbar: boolean
}

const Nav = (props: Props) => {
  const { resolvedTheme } = useTheme()
  const router = useRouter()
  const { width } = useWindowSize()
  const [open, setOpen] = useState(false)
  const isLoggedIn = useIsLoggedIn()
  const isUserLoading = useIsUserLoading()

  const isHomePage = router.pathname === '/'
  const isLaunchWeekPage = router.pathname.includes('/launch-week')
  const isLaunchWeekXPage = router.pathname === '/launch-week/x'
  const isLaunchWeek11Page = router.pathname === '/ga-week'
  const hasStickySubnav = isLaunchWeekXPage || isLaunchWeek11Page || isLaunchWeekPage
  const showLaunchWeekNavMode = (isLaunchWeekPage || isLaunchWeek11Page) && !open

  React.useEffect(() => {
    if (open) {
      // Prevent scrolling on mount
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  // Close mobile menu when desktop
  React.useEffect(() => {
    if (width >= 1024) setOpen(false)
  }, [width])

  if (props.hideNavbar) {
    return null
  }

  const showDarkLogo = isLaunchWeekPage || resolvedTheme?.includes('dark')! || isHomePage

  return (
    <>
      <Announcement>
        <LW12CountdownBanner />
      </Announcement>
      <div
        className={cn('sticky top-0 z-40 transform', hasStickySubnav && 'relative')}
        style={{ transform: 'translate3d(0,0,999px)' }}
      >
        <nav
          className={cn(
            `relative z-40 border-default border-b backdrop-blur-sm transition-opacity`,
            showLaunchWeekNavMode && 'border-muted border-b bg-alternative/50'
          )}
        >
          <div className="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
            <div className="flex items-center px-6 lg:px-0 flex-1 sm:items-stretch justify-between">
              <div className="flex items-center">
                <div className="flex items-center flex-shrink-0">
                  <RightClickBrandLogo />
                </div>
                <NavigationMenu
                  delayDuration={0}
                  className="hidden pl-8 sm:space-x-4 lg:flex h-16"
                  viewportClassName="rounded-xl bg-background"
                >
                  <NavigationMenuList>
                    {menu.primaryNav.map((menuItem) =>
                      menuItem.hasDropdown ? (
                        <NavigationMenuItem className="text-sm font-medium" key={menuItem.title}>
                          <NavigationMenuTrigger
                            className={cn(
                              buttonVariants({ type: 'text', size: 'small' }),
                              '!bg-transparent hover:text-brand-link data-[state=open]:!text-brand-link data-[radix-collection-item]:focus-visible:ring-2 data-[radix-collection-item]:focus-visible:ring-foreground-lighter data-[radix-collection-item]:focus-visible:text-foreground px-2 h-auto'
                            )}
                          >
                            {menuItem.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>{menuItem.dropdown}</NavigationMenuContent>
                        </NavigationMenuItem>
                      ) : (
                        <NavigationMenuItem className="text-sm font-medium" key={menuItem.title}>
                          <NavigationMenuLink asChild>
                            <MenuItem
                              href={menuItem.url}
                              title={menuItem.title}
                              className="group-hover:bg-transparent text-foreground focus-visible:text-brand-link"
                              hoverColor="brand"
                            />
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      )
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
              <div className="flex items-center gap-2 opacity-0 animate-fade-in !scale-100 delay-300">
                <GitHubButton />
                {!isUserLoading && (
                  <>
                    {isLoggedIn ? (
                      <Button className="hidden text-white lg:block" asChild>
                        <Link href="/dashboard/projects">Dashboard</Link>
                      </Button>
                    ) : (
                      <>
                        <Button type="default" className="hidden lg:block" asChild>
                          <Link href="https://supabase.com/dashboard">Sign in</Link>
                        </Button>
                        <Button className="hidden lg:block" asChild>
                          <Link href="https://supabase.com/dashboard">Start your project</Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <HamburgerButton
              toggleFlyOut={() => setOpen(true)}
              showLaunchWeekNavMode={showLaunchWeekNavMode}
            />
          </div>
          <MobileMenu open={open} setOpen={setOpen} isDarkMode={showDarkLogo} menu={menu} />
        </nav>

        <ScrollProgress />
      </div>
    </>
  )
}

export default Nav
