// ** React Imports
import { useContext } from 'react'

// ** Component Imports
// import { AbilityContext } from 'src/layouts/components/acl/Can'
import { createContext } from 'react'
import { createContextualCan } from '@casl/react'

const AbilityContext = createContext(undefined)



const CanViewNavLink = props => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = useContext(createContextualCan(AbilityContext.Consumer))

//  console.log('children' , children, 'ability' ,ability && ability.can(navLink?.action, navLink?.subject) ? <>{children}</> : null)
    return <>{children}</>

}

export default CanViewNavLink
