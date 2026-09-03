'use client'

import { useState } from 'react'
import type { RoadmapEvent } from '@/types'

interface RoadmapTimelineProps {
  events: RoadmapEvent[]
  providerId?: string
}

const STATUS_CONFIG: Record<
  RoadmapEvent['status'],
  { color: string; bg: string; label: string }
> = {
  released: { color: '#4ADE80', bg: 'rgba(74,222,128,0.12)', label: 'Released' },
  current: { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)', label: 'Current' },
  announced: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Announced' },
  targeted: { color: '#9AA4B2', bg: 'rgba(154,164,178,0.1)', label: 'Targeted' },
  conceptual: { color: '#3D4754', bg: 'rgba(61,71,84,0.1)', label: 'Conceptual' },
}

function sortByDate(events: RoadmapEvent[]): RoadmapEvent[] {
  return [...events].sort((a, b) => {
    const aDate = a.targetDate ?? a.announcedDate
    const bDate = b.targetDate ?? b.announcedDate
    return aDate.localeCompare(bDate)
  })
}

function formatEventDate(event: RoadmapEvent): string {
  const raw = event.targetDate ?? event.announcedDate
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export function RoadmapTimeline({ events }: RoadmapTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (events.length === 0) {
    return (
      <div
        style={{
          padding: '32px 24px',
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '13px',
        }}
      >
        Hardware roadmap data not currently available.
      </div>
    )
  }

  const sorted = sortByDate(events)
  const DOT_RADIUS = 8
  const TRACK_Y = 60
  const LABEL_HEIGHT = 48
  const SVG_HEIGHT = TRACK_Y + LABEL_HEIGHT + DOT_RADIUS + 24
  const MIN_WIDTH = 800
  const PADDING_X = 40

  // Position dots evenly
  const count = sorted.length
  const slotWidth = count > 1 ? (MIN_WIDTH - PADDING_X * 2) / (count - 1) : 0

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      <div style={{ position: 'relative', minWidth: MIN_WIDTH }}>
        <svg
          width="100%"
          viewBox={`0 0 ${MIN_WIDTH} ${SVG_HEIGHT}`}
          style={{ display: 'block' }}
          aria-label="Hardware roadmap timeline"
        >
          {/* Track line */}
          <line
            x1={PADDING_X}
            y1={TRACK_Y}
            x2={MIN_WIDTH - PADDING_X}
            y2={TRACK_Y}
            stroke="var(--color-border)"
            strokeWidth={2}
          />

          {sorted.map((event, i) => {
            const cx = count === 1 ? MIN_WIDTH / 2 : PADDING_X + i * slotWidth
            const cfg = STATUS_CONFIG[event.status]
            const isHovered = hoveredId === event.id
            const above = i % 2 === 0

            // Label positions
            const labelX = cx
            const dateY = above ? TRACK_Y - DOT_RADIUS - 10 : TRACK_Y + DOT_RADIUS + 18
            const titleY = above ? dateY - 16 : dateY + 14

            return (
              <g
                key={event.id}
                onMouseEnter={() => setHoveredId(event.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`${event.title} — ${cfg.label}`}
                tabIndex={0}
                onFocus={() => setHoveredId(event.id)}
                onBlur={() => setHoveredId(null)}
              >
                {/* Connector line */}
                <line
                  x1={cx}
                  y1={TRACK_Y + (above ? -DOT_RADIUS : DOT_RADIUS)}
                  x2={cx}
                  y2={above ? TRACK_Y - DOT_RADIUS - 8 : TRACK_Y + DOT_RADIUS + 8}
                  stroke={cfg.color}
                  strokeWidth={1}
                  strokeOpacity={0.4}
                />

                {/* Dot */}
                <circle
                  cx={cx}
                  cy={TRACK_Y}
                  r={isHovered ? DOT_RADIUS + 2 : DOT_RADIUS}
                  fill={cfg.color}
                  fillOpacity={0.2}
                  stroke={cfg.color}
                  strokeWidth={2}
                  style={{ transition: 'r 0.12s' }}
                />
                <circle
                  cx={cx}
                  cy={TRACK_Y}
                  r={DOT_RADIUS - 4}
                  fill={cfg.color}
                />

                {/* Date */}
                <text
                  x={labelX}
                  y={dateY}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="var(--font-mono), monospace"
                  fill="var(--color-text-muted)"
                  letterSpacing="0.05em"
                >
                  {formatEventDate(event)}
                </text>

                {/* Title */}
                <text
                  x={labelX}
                  y={titleY}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={500}
                  fill={isHovered ? cfg.color : 'var(--color-text-secondary)'}
                  style={{ transition: 'fill 0.12s' }}
                >
                  {event.title.length > 20 ? event.title.slice(0, 18) + '…' : event.title}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Tooltip overlay */}
        {hoveredId && (() => {
          const ev = sorted.find(e => e.id === hoveredId)
          if (!ev) return null
          const cfg = STATUS_CONFIG[ev.status]
          return (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--color-bg-panel)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                maxWidth: 280,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 10,
                    padding: '1px 7px',
                    borderRadius: 4,
                    background: cfg.bg,
                    color: cfg.color,
                    fontWeight: 600,
                  }}
                >
                  {cfg.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {formatEventDate(ev)}
                </span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
                {ev.title}
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {ev.description}
              </p>
            </div>
          )
        })()}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: cfg.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
