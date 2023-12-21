"use client"
import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

const dummyData = [
  {
    id: 1,
    points: [900, 912, 1100, 1050, 1050, 1060, 1010],
  },
  {
    id: 2,
    points: [1130, 1111, 1000, 1032, 1032, 1032, 1032],
  },
  {
    id: 3,
    points: [912, 1175, 1100, 1187, 1187, 1111, 1120],
  },
] // Example data

export default function Chart() {
  const width = 512
  const height = 128
  const padding = 8

  // Create scales
  const x = d3
    .scaleLinear()
    .domain([0, dummyData[0].points.length - 1]) // TODO:
    .range([padding, width - padding])

  const y = d3
    .scaleLinear()
    .domain([900, 1200]) // TODO:
    .range([height - padding, padding])

  // Create line generator
  const line = d3
    .line<number>()
    .defined((d) => !isNaN(d))
    .x((d, i) => x(i))
    .y((d, i) => y(d))
    .curve(d3.curveCatmullRom.alpha(0.5))

  const activePoints = dummyData.at(-1)!.points

  return (
    <div className="w-full my-8">
      <svg fill="#000" vectorEffect="non-scaling-stroke" width={width} height={height}>
        {dummyData.map((member) => (
          <path
            key={member.id}
            d={line(member.points)!}
            stroke={member.id === 3 ? `#E6A320` : "#cbcbcb"}
            strokeWidth={2}
            fill="none"
          ></path>
        ))}

        {activePoints.map((point, i) => (
          <circle key={i} cx={x(i)} cy={y(point)} r={3} stroke="#F3F0EA" fill="#E6A320" />
        ))}
      </svg>
    </div>
  )
}
