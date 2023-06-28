import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react'
import _regl from 'regl'

export const ReglContext = createContext(null)

export const useRegl = () => {
  return useContext(ReglContext)
}

const Regl = ({ style, extensions, children }) => {
  const regl = useRef()
  const containerRef = useRef()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
      regl.current = _regl({
        container: containerRef.current,
        extensions: ['OES_texture_float', 'OES_element_index_uint'],
      })
      setReady(true)
      return () => {
        if (regl.current) regl.current.destroy()
        setReady(false)
      }
  }, [])

  return (
    <ReglContext.Provider
      value={{
        regl: regl.current,
      }}
    >
      <div style={{ width: '100%', height: '100%', ...style }} ref={containerRef} />
      {ready && children}
    </ReglContext.Provider>
  )
}

export default Regl
