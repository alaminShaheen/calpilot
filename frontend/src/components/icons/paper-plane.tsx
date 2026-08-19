/**
 * Converted from paper-plane-svgrepo-com.svg.
 *
 * Changes from the raw file: width/height dropped so `className` controls size,
 * the shared stroke attributes hoisted onto <svg> (SVG presentation attributes
 * inherit), and stroke="#000000" swapped for currentColor so Tailwind text
 * utilities drive the colour.
 */
type Props = {
	className?: string;
};

const PaperPlaneIcon = ({ className }: Props) => (
	<svg
		viewBox="0 0 400 400"
		fill="none"
		stroke="currentColor"
		strokeOpacity={0.9}
		strokeWidth={16}
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden
		className={className}
	>
		<path d="M138.428 194.168C132.823 193.515 92.6669 168.574 95.1067 166.118C95.5732 165.647 235.401 146.283 265.287 136.236C269.462 134.835 303.291 120.195 304.959 121.035C306.019 121.569 292.192 145.628 291.471 148.236C271.97 218.741 259.324 282.809 258.861 279.097C257.918 271.486 207.496 239.383 190.709 225.84" />
		<path d="M281.949 138.636C265.387 144.131 251.195 153.444 235.931 161.837C222.011 169.495 169.029 194.033 159.766 201.041C157.518 202.74 159.488 207.082 159.766 209.041C163.901 238.222 169.707 265.325 170.079 265.041C179.121 258.205 173.583 228.554 185.947 220.239C225.091 193.928 267.31 174.175 292.262 132.236" />
		<path d="M170.949 265.352C182.286 256.842 193.084 247.534 204.994 241.863" />
	</svg>
);

export default PaperPlaneIcon;
