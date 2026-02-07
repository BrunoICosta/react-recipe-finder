import type { SVGProps } from 'react'

type FlagProps = SVGProps<SVGSVGElement>

/**
 * Decorative 28x20 flags. Rounded corners come from the wrapper (overflow hidden),
 * so no clipPath ids are needed and several instances can coexist on the page.
 */
export function BrazilFlag(props: FlagProps) {
  return (
    <svg viewBox="0 0 28 20" width={28} height={20} aria-hidden="true" focusable="false" {...props}>
      <rect width="28" height="20" fill="#009C3B" />
      <path d="M14 2.5 25.5 10 14 17.5 2.5 10Z" fill="#FFDF00" />
      <circle cx="14" cy="10" r="4.6" fill="#002776" />
      <path d="M9.6 8.9c3-.9 6.3-.6 8.9 1.1l-.3.9c-2.5-1.6-5.6-1.9-8.4-1.1Z" fill="#fff" />
    </svg>
  )
}

const STAR_ROWS = [
  { y: 2, xs: [2, 5, 8, 11] },
  { y: 4, xs: [3.5, 6.5, 9.5] },
  { y: 6, xs: [2, 5, 8, 11] },
  { y: 8, xs: [3.5, 6.5, 9.5] },
]

export function UsaFlag(props: FlagProps) {
  return (
    <svg viewBox="0 0 28 20" width={28} height={20} aria-hidden="true" focusable="false" {...props}>
      <rect width="28" height="20" fill="#fff" />
      <path
        d="M0 0h28M0 3.08h28M0 6.15h28M0 9.23h28M0 12.3h28M0 15.38h28M0 18.46h28"
        stroke="#B22234"
        strokeWidth="1.54"
        transform="translate(0 .77)"
      />
      <rect width="12" height="10.77" fill="#3C3B6E" />
      <g fill="#fff">
        {STAR_ROWS.flatMap(({ y, xs }) =>
          xs.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r=".6" />),
        )}
      </g>
    </svg>
  )
}
