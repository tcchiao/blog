import { Box, Flex } from 'theme-ui'
import React from 'react'
import {
  Chart,
  Axis,
  AxisLabel,
  Ticks,
  TickLabels,
  Plot,
  Point,
  Scatter,
  Line,
  Grid,
  Label,
  useChart,
} from '@carbonplan/charts'
import { Column, Row } from '@carbonplan/components'

import { LargeTree, SmallTree } from './trees'
import data from './data.json'

const sx = {
  reference: {
    borderLeftWidth: '2px',
    borderStyle: 'dashed',
    opacity: 1,
  },
}

const RANGE = [603260, 603225]

const LINES = [
  ['alternative_ground_peak', 'pink', 'Alternative ground peak'],
  ['ground_peak', 'yellow', 'Ground peak'],
  ['signal_beginning', 'green', 'Signal beginning'],
  ['signal_end', 'green', 'Signal end'],
]

const HEIGHTS = [500, 500, 450, 500]

const Arrow = ({ color, x, y, start }) => {
  return (
    <Box sx={{ display: ['initial', 'initial', 'none', 'none'] }}>
      <Point x={x} y={y} verticalAlign={!start ? 'top' : 'bottom'}>
        <Box
          as='svg'
          viewBox='0 0 12 12'
          fill='none'
          width='12'
          height='12'
          strokeWidth='1'
          sx={{
            stroke: color,
            ml: '-6px',
            mb: start ? '-6px' : '6px',
          }}
          transform={start ? 'rotate(180)' : null}
        >
          <line x1='1' y1='11' x2='6.2' y2='0' />
          <line x1='5.8' y1='0' x2='11' y2='11' />
        </Box>
      </Point>
    </Box>
  )
}
const Trees = () => {
  const { x, y } = useChart()
  return (
    <>
      <Flex
        sx={{
          position: 'absolute',
          gap: 3,
          left: `calc(${x(0.5)}% + 20px)`,
          top: `${y(data.signal_beginning) - 2}%`,
          alignContent: 'flex-start',
        }}
      >
        <LargeTree
          sx={{ display: ['none', 'none', 'initial', 'initial'] }}
          height={HEIGHTS.map(
            (height) =>
              (Math.abs(y(data.ground_peak) - y(data.signal_beginning)) / 100) *
              height *
              0.9
          )}
        />

        <SmallTree
          sx={{ display: ['none', 'none', 'initial', 'initial'] }}
          height={HEIGHTS.map(
            (height) =>
              (Math.abs(
                y(data.alternative_ground_peak) - y(data.signal_beginning)
              ) /
                100) *
              height *
              0.9
          )}
        />
      </Flex>
    </>
  )
}

const TreeLines = () => {
  return (
    <>
      <Line
        data={[
          [0.5, data.ground_peak],
          [0.5, data.signal_beginning],
        ]}
        sx={{
          stroke: 'yellow',
          strokeWidth: 1,
          display: ['initial', 'initial', 'none', 'none'],
        }}
      />
      <Line
        data={[
          [0.7, data.alternative_ground_peak],
          [0.7, data.signal_beginning],
        ]}
        sx={{
          stroke: 'pink',
          strokeWidth: 1,
          display: ['initial', 'initial', 'none', 'none'],
        }}
      />
    </>
  )
}

const Figure = () => {
  return (
    <Row columns={6}>
      <Column start={1} width={6}>
        <Box
          sx={{
            height: HEIGHTS,
          }}
        >
          <Chart x={[-0.04, 0.5 / 0.4 - 0.04]} y={RANGE} clamp={false}>
            <Axis left bottom />
            <AxisLabel bottom units='joules' arrow={false}>
              <Box as='span' sx={{ textTransform: 'none' }}>
                LiDAR
              </Box>
              &nbsp;return
            </AxisLabel>
            <AxisLabel left units='m' arrow={false}>
              Distance from satellite
            </AxisLabel>
            <Ticks left bottom />
            <TickLabels left format={(d) => d % RANGE[1]} />
            <TickLabels bottom />
            <Grid vertical values={[0.013915494217939783]} sx={sx.reference} />
            <Plot sx={{ position: 'relative' }}>
              <Scatter
                size={5}
                data={data.raw.filter((d) => d[1] > RANGE[1])}
                color='secondary'
              />
              <Line
                data={data.smoothed.filter((d) => d[1] > RANGE[1])}
                width={2}
                color='primary'
              />
              {LINES.map(([key, color]) => (
                <Line
                  key={key}
                  data={[
                    [-0.04, data[key]],
                    [0.5 / 0.4 - 0.04, data[key]],
                  ]}
                  sx={{
                    stroke: color,
                    strokeWidth: 1,
                    strokeDasharray: 4,
                  }}
                />
              ))}
              <TreeLines />
            </Plot>
            <Trees />

            <Arrow color='yellow' x={0.5} y={data.ground_peak} start />
            <Arrow color='yellow' x={0.5} y={data.signal_beginning} end />
            <Arrow
              color='pink'
              x={0.7}
              y={data.alternative_ground_peak}
              start
            />
            <Arrow color='pink' x={0.7} y={data.signal_beginning} end />

            {LINES.map(([key, color, label]) => (
              <Label
                key={key}
                x={0.5 / 0.4 - 0.04}
                align='right'
                verticalAlign='bottom'
                y={data[key]}
                sx={{ color, backgroundColor: 'background', mb: '2px' }}
              >
                {label}
              </Label>
            ))}
          </Chart>
        </Box>
      </Column>
    </Row>
  )
}

export default Figure
