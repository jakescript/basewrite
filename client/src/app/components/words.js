'use client'

import { useEffect, useRef } from 'react'

const wordHeight = 16
const RADIUS = 120
const FADE_SPEED = 0.05
const PADDING_BETWEEN_PHRASES = 4

const CanvasWords = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouse = useRef({ x: -1000, y: -1000 })
  const inactivityTimeout = useRef(null)
  const wordGrid = useRef([])
  const phraseWidthRef = useRef(0)

  const phrase = [
    { text: 'BASE ', weight: 400 },
    { text: 'WRITE', weight: 700 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      generateWordGrid()
    }

    const generateWordGrid = () => {
      let totalWidth = 0
      phrase.forEach(part => {
        ctx.font = `${part.weight === 700 ? 'bold' : 'normal'} 11px 'Ubuntu Sans Mono'`
        totalWidth += ctx.measureText(part.text).width
      })
      totalWidth += PADDING_BETWEEN_PHRASES
      phraseWidthRef.current = totalWidth

      const cols = Math.ceil(window.innerWidth / totalWidth)
      const rows = Math.ceil(window.innerHeight / wordHeight)
      wordGrid.current = []

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          wordGrid.current.push({
            x: x * totalWidth,
            y: y * wordHeight + wordHeight,
            opacity: 0.1,
            targetOpacity: 0.1,
          })
        }
      }
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      for (const w of wordGrid.current) {
        const centerX = w.x + phraseWidthRef.current / 2
        const centerY = w.y - wordHeight / 2
        const dx = centerX - mouse.current.x
        const dy = centerY - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        w.targetOpacity = dist < RADIUS ? 0.8 : 0.1
        w.opacity += (w.targetOpacity - w.opacity) * FADE_SPEED

        let currentX = w.x

        ctx.save()
        ctx.globalAlpha = w.opacity
        // ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
        // const maxBlur = 1
        // ctx.shadowBlur = (1 - w.opacity) * maxBlur

        for (const part of phrase) {
          ctx.font = `${part.weight === 700 ? 'bold' : 'normal'} 11px 'Ubuntu Sans Mono'`
          ctx.fillStyle = 'black'
          ctx.fillText(part.text, Math.round(currentX), Math.round(w.y))
          const partWidth = ctx.measureText(part.text).width
          currentX += partWidth
        }

        ctx.restore()
      }

      animationRef.current = requestAnimationFrame(update)
    }

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      // Reset inactivity timer
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current)
      }

      inactivityTimeout.current = setTimeout(() => {
        // Pretend mouse left screen
        mouse.current.x = -1000
        mouse.current.y = -1000
      }, 1500)
    }

    const handleMouseLeave = () => {
      mouse.current.x = -1000
      mouse.current.y = -1000
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current)
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('pointerleave', handleMouseLeave)
    window.addEventListener('blur', handleMouseLeave)

    animationRef.current = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('pointerleave', handleMouseLeave)
      window.removeEventListener('blur', handleMouseLeave)

      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-[-1] select-none"
    />
  )
}

export default CanvasWords

