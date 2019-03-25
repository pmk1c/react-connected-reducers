import { Namespace } from '.'

type RevisionBumper = () => void

interface RevisionBumpers {
  [key: string]: RevisionBumper[];
}

const revisionBumpers: RevisionBumpers = {}

function getNamespaceBumpers (namespace: Namespace): RevisionBumper[] {
  return revisionBumpers[namespace.toString()] || []
}

function setNamespaceBumpers (namespace: Namespace, namespaceBumpers: RevisionBumper[]): void {
  revisionBumpers[namespace.toString()] = namespaceBumpers
}

export function addBumper (namespace: Namespace, bumper: RevisionBumper): void {
  const namespaceBumpers = getNamespaceBumpers(namespace)
  setNamespaceBumpers(namespace, [...namespaceBumpers, bumper])
}

export function removeBumper (namespace: Namespace, bump: RevisionBumper): void {
  const namespaceBumpers = getNamespaceBumpers(namespace)
  setNamespaceBumpers(namespace, namespaceBumpers.filter(b => b !== bump))
}

export function hasRevisionBumper (namespace: Namespace, bumper: RevisionBumper): boolean {
  return getNamespaceBumpers(namespace).includes(bumper)
}

export function bumpNamespace (namespace: Namespace): void {
  getNamespaceBumpers(namespace).forEach((bump: RevisionBumper) => bump())
}

export function resetBumpers (): void {
  Object.keys(revisionBumpers).forEach(key => {
    delete revisionBumpers[key]
  })
}
