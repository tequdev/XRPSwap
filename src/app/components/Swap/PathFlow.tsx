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
      .map((computed, computedIndex, originalPath) => {
        let cur_currency: string = parseCurrencyName(source)
        return computed.map((step, stepIndex, originalSteps): PathNode => {
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

          const label = (step: PathOption['paths_computed'][number][number]) => {
            if (step.issuer) {
              // type: 32(issuer) or type: 48(issuer+currency)
              return cur_currency + '/' + parseCurrencyName(step as Currency)
            }
            if (step.account) {
              // type: 1(account)(rippling)
              return parseCurrencyName({
                currency: cur_currency.split('.')[0],
                issuer: step.account,
              } as Currency)
            }
            return parseCurrencyName(step as Currency)
          }
          const node = {
            id: computedIndex + '-' + stepIndex,
            position: { x: 200 * (computedIndex + 1 - 1), y: 100 * (stepIndex + 1) },
            data: {
              label: label(step),
            },
          }
          if (step.currency) {
            cur_currency = parseCurrencyName(step as Currency)
          }
          return node
        })
      })
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
