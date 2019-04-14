import { Namespace } from '.'

export type RevisionBumper = () => void

interface RevisionBumpers {
  [key: string]: RevisionBumper[];
}

const revisionBumpers: RevisionBumpers = {}

function getNamespaceBumpers (namespace: Namespace): RevisionBumper[] {
  return revisionBumpers[namespace] || []
}

function setNamespaceBumpers (namespace: Namespace, namespaceBumpers: RevisionBumper[]): void {
  revisionBumpers[namespace] = namespaceBumpers
}

export function addBumper (namespace: Namespace, bumper: RevisionBumper): void {
  const namespaceBumpers = getNamespaceBumpers(namespace)
  setNamespaceBumpers(namespace, [...namespaceBumpers, bumper])
}

export function removeBumper (namespace: Namespace, bump: RevisionBumper): void {
  const namespaceBumpers = getNamespaceBumpers(namespace)
  setNamespaceBumpers(namespace, namespaceBumpers.filter(b => b !== bump))
}

export function bumpNamespace (namespace: Namespace): void {
  getNamespaceBumpers(namespace).forEach((bump: RevisionBumper) => bump())
}

// NOTE: These are only used for testing.

export function __getRevisionBumpers (): RevisionBumpers {
  return revisionBumpers
}

export function __resetRevisionBumpers (): void {
  Object.keys(revisionBumpers).forEach(k => delete revisionBumpers[k])
}
