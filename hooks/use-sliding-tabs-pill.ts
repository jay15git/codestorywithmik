"use client"

import { useEffect, type RefObject } from "react"

export function useSlidingTabsPill(
  listRef: RefObject<HTMLElement | null>,
  pillRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return

    const list = listRef.current
    const pill = pillRef.current
    if (!list || !pill) return

    const moveTo = (tab: HTMLElement, animate: boolean) => {
      if (!animate) {
        const prev = pill.style.transition
        pill.style.transition = "none"
        pill.style.transform = `translateX(${tab.offsetLeft}px)`
        pill.style.width = `${tab.offsetWidth}px`
        void pill.offsetWidth
        pill.style.transition = prev
      } else {
        pill.style.transform = `translateX(${tab.offsetLeft}px)`
        pill.style.width = `${tab.offsetWidth}px`
      }
    }

    const activeTab = () =>
      list.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-active]') ??
      list.querySelector<HTMLElement>('[data-slot="tabs-trigger"]')

    const sync = (animate: boolean) => {
      const tab = activeTab()
      if (tab) moveTo(tab, animate)
    }

    const observer = new MutationObserver(() => sync(true))
    observer.observe(list, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-active"],
    })

    requestAnimationFrame(() => sync(false))

    const onResize = () => sync(false)
    window.addEventListener("resize", onResize)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", onResize)
    }
  }, [enabled, listRef, pillRef])
}
