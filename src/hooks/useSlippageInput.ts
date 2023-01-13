import { ChangeEventHandler, FocusEventHandler, useCallback, useState } from 'react'

const initialSlippage = 0.05 // %

export const useSlippageInput = () => {
  const [value, setValue] = useState(initialSlippage.toString())
  const [slippage, setSlippage] = useState(initialSlippage / 100)

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    let input = e.target.value
    if (/0[1-9].*/.test(input)) {
      input = input.slice(1)
    }
    if (input === '' || input === '100' || /^([1-9]{1}[0-9]?|0)(\.\d{0,2})?$/.test(input)) {
      setValue(input)
    }
  }, [])

  const onBlur: FocusEventHandler<HTMLInputElement> = useCallback((e) => {
    const input = e.target.value
    let v = input
    if (input === '') {
      v = '0'
    } else if (/^(\d*)(\.\d{0,4})?$/.test(input)) {
      v = input
    }
    const i = parseFloat(v)
    if (!isNaN(i)) {
      setValue(i.toString())
      setSlippage(i / 100)
    } else {
      setValue(initialSlippage.toString())
      setSlippage(initialSlippage / 100)
    }
  }, [])

  return {
    value,
    slippage,
    onChange,
    onBlur,
  }
}
