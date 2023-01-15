import { FC, useEffect } from 'react'
import { useCallback } from 'react'
import ReactFlow, { useNodesState, useEdgesState, addEdge, Node, Edge, Connection } from 'reactflow'
import { Currency } from 'xrpl/dist/npm/models/common'

import { PathOption } from '@/@types/xrpl'
import { parseCurrencyName } from '@/utils/xrpl'

import 'reactflow/dist/style.css'

type PathNode = Node<{ label: string }>
type PathEdge = Edge

type Props = {
  path: PathOption
}
export const PathFlow: FC<Props> = ({ path }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<{ label: string }>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])

  useEffect(() => {
    let edges: PathEdge[] = []
    const source = path.source_amount
    const destination = path.destination_amount
    const pathsColCount = path.paths_computed.length
    const pathsRowCount = Math.max(...path.paths_computed.map((path) => path.length))
    const inputNode: PathNode = {
      id: 'start',
      type: 'input',
      position: { x: 200 * (pathsColCount - 1) * 0.5, y: 0 },
      data: { label: parseCurrencyName(source) },
    }
    const outputNode: PathNode = {
      id: 'end',
      type: 'output',
      position: { x: 200 * (pathsColCount - 1) * 0.5, y: 100 * (pathsRowCount + 1) },
      data: { label: parseCurrencyName(destination) },
    }
    const middleNodes = path.paths_computed
      .map((computed, computedIndex, originalPath) =>
        computed.map((step, stepIndex, originalSteps): PathNode => {
          const getId = (stepIdx: number) => computedIndex + '-' + stepIdx
          const id = getId(stepIndex)
          const nextId = getId(stepIndex + 1)
          const isFirst = stepIndex === 0
          const isLast = stepIndex === originalSteps.length - 1
          if (isFirst) {
            const firstEdge = { id: id + '-first', source: 'start', target: id }
            edges = [...edges, { ...firstEdge }]
          }
          if (isLast) {
            const lastEdge = { id, source: id, target: 'end' }
            edges = [...edges, { ...lastEdge }]
          } else {
            const edge = { id, source: id, target: nextId }
            edges = [...edges, { ...edge }]
          }
          if (!isFirst && !isLast) {
          }
          const label = () => {
            if (stepIndex === 0) {
              // source/stepCurrency
              return parseCurrencyName(source) + '/' + parseCurrencyName(step as Currency)
            }
            return (
              parseCurrencyName(originalSteps[stepIndex - 1] as Currency) + '/' + parseCurrencyName(step as Currency)
            )
          }
          return {
            id: computedIndex + '-' + stepIndex,
            position: { x: 200 * (computedIndex + 1 - 1), y: 100 * (stepIndex + 1) },
            data: {
              label: label(),
            },
          }
        })
      )
      .flatMap((path) => path)
    setNodes([inputNode, ...middleNodes, outputNode])
    setEdges(edges)
  }, [path.destination_amount, path.paths_computed, path.source_amount, setEdges, setNodes])

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      attributionPosition='bottom-right'
      fitView
    />
  )
}
