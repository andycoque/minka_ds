import * as React from "react"

export function usePlatform() {
  const [isMac, setIsMac] = React.useState(true)

  React.useEffect(() => {
    setIsMac(navigator.userAgent.includes("Mac"))
  }, [])

  return { isMac }
}
