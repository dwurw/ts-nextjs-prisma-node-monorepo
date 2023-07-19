export default function getClassNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}