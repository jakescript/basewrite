'use client'

import { useEffect, useRef } from 'react'

const wordWidth = 34
const wordHeight = 16
const RADIUS = 100

const RepeatingWords = () => {
  const containerRef = useRef(null)
  const words = ['BASE', 'WRITE']
  const wordRefs = useRef([])
  const timeoutMap = useRef(new WeakMap())
  const inactivityTimeout = useRef(null)

  useEffect(() => {
    const cols = Math.ceil(window.innerWidth / wordWidth)
    const rows = Math.ceil(window.innerHeight / wordHeight)
    const total = cols * rows

    wordRefs.current = []

    const elements = Array.from({ length: total }, (_, i) => {
      const el = document.createElement('p')
      el.textContent = words[i % words.length]
      el.className =
        'flex items-center justify-center opacity-[10%] transition-transform duration-300 ease-in-out cursor-pointer'
      el.style.fontSize = '11px'
      el.style.transition = 'all 0.2s ease-in-out'
      el.style.fontWeight = i % words.length ? '400' : '800'
      el.style.opacity = '0.1'
      el.style.filter = 'blur(1.25px)'
      wordRefs.current.push(el)
      return el
    })

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      elements.forEach(el => containerRef.current?.appendChild(el))
    }

    const fadeOutWord = (word) => {
      word.style.transform = 'scale(1)'
      word.style.color = ''
      word.style.opacity = '0.1'
      word.style.filter = 'blur(2px)'
    }

    const handleMouseMove = (e) => {
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current)
      }

      inactivityTimeout.current = setTimeout(() => {
        wordRefs.current.forEach(word => {
          word.style.transition = 'all 0.8s ease-out'
          fadeOutWord(word)
          timeoutMap.current.delete(word)
        })
      }, 800)

      wordRefs.current.forEach(word => {
        const rect = word.getBoundingClientRect()
        const wordX = rect.left + rect.width / 2
        const wordY = rect.top + rect.height / 2
        const dx = wordX - e.clientX
        const dy = wordY - e.clientY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < RADIUS) {
          const existingTimeout = timeoutMap.current.get(word)
          if (existingTimeout) {
            clearTimeout(existingTimeout)
            timeoutMap.current.delete(word)
          }

          word.style.transition = 'all 0.2s ease-in-out'
          word.style.opacity = '0.8'
          word.style.filter = 'blur(0px)'
        } else {
          if (!timeoutMap.current.has(word)) {
            const timeoutId = window.setTimeout(() => {
              fadeOutWord(word)
              timeoutMap.current.delete(word)
            }, 200)
            timeoutMap.current.set(word, timeoutId)
          }
        }
      })
    }

    const handleMouseLeave = () => {
      // Trigger same fade-out styles as the timeout version
      wordRefs.current.forEach(word => {
        word.style.transition = 'all 0.8s ease-out'
        fadeOutWord(word)
        timeoutMap.current.delete(word)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('pointerleave', handleMouseLeave)
    window.addEventListener('blur', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('pointerleave', handleMouseLeave)
      window.removeEventListener('blur', handleMouseLeave)

      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="grid w-screen h-screen absolute select-none overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${wordWidth}px, 1fr))`,
        gridAutoRows: `minmax(${wordHeight}px, auto)`,
      }}
    />
  )
}

export default RepeatingWords

