export default function ThermoMeter({
  size,
  className,
}: {
  size?: string;
  className: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      viewBox="100 100 300 300"
    >
      <defs>
        <symbol id="meteoconsThermometerSunFill0" viewBox="0 0 196 196">
          <circle
            cx="98"
            cy="98"
            r="40"
            fill="url(#meteoconsThermometerSunFill4)"
            stroke="#f8af18"
            strokeMiterlimit="10"
            strokeWidth="4"
          />
          <path
            fill="none"
            stroke="#fbbf24"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="12"
            d="M98 31.4V6m0 184v-25.4M145.1 51l18-17.9M33 163l18-17.9M51 51L33 33m130.1 130.1l-18-18M6 98h25.4M190 98h-25.4"
          >
            <animateTransform
              additive="sum"
              attributeName="transform"
              dur="6s"
              repeatCount="indefinite"
              type="rotate"
              values="0 98 98; 45 98 98"
            />
          </path>
        </symbol>
        <symbol id="meteoconsThermometerSunFill1" viewBox="0 0 72 168">
          <circle cx="36" cy="132" r="36" fill="#ef4444" />
          <path
            fill="none"
            stroke="#ef4444"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="24"
            d="M36 12v120"
          >
            <animateTransform
              attributeName="transform"
              calcMode="spline"
              dur="1s"
              keySplines=".42, 0, .58, 1; .42, 0, .58, 1"
              repeatCount="indefinite"
              type="translate"
              values="0 0; 0 18; 0 0"
            />
          </path>
        </symbol>
        <symbol id="meteoconsThermometerSunFill2" viewBox="0 0 118 278">
          <path
            fill="url(#meteoconsThermometerSunFill5)"
            stroke="url(#meteoconsThermometerSunFill6)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
            d="M115 218.2c0 31.4-25 56.8-56 56.8S3 249.6 3 218.2a57 57 0 0 1 24-46.6V35.5a32 32 0 1 1 64 0v136a57 57 0 0 1 24 46.7ZM63 83h28M63 51h28m-28 64h28"
          />
        </symbol>
        <symbol id="meteoconsThermometerSunFill3" viewBox="0 0 118 278">
          <use
            width="72"
            height="168"
            href="#meteoconsThermometerSunFill1"
            transform="translate(23 87)"
          />
          <use width="118" height="278" href="#meteoconsThermometerSunFill2" />
        </symbol>
        <linearGradient
          id="meteoconsThermometerSunFill4"
          x1="78"
          x2="118"
          y1="63.4"
          y2="132.7"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset=".5" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient
          id="meteoconsThermometerSunFill5"
          x1="-7.2"
          x2="116.4"
          y1="36.3"
          y2="250.4"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#515a69" stopOpacity=".1" />
          <stop offset=".5" stopColor="#6b7280" stopOpacity=".1" />
          <stop offset="1" stopColor="#384354" stopOpacity=".1" />
        </linearGradient>
        <linearGradient
          id="meteoconsThermometerSunFill6"
          x1="-8.7"
          x2="117.9"
          y1="33.7"
          y2="253"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#d4d7dd" />
          <stop offset=".5" stopColor="#d4d7dd" />
          <stop offset="1" stopColor="#bec1c6" />
        </linearGradient>
        <clipPath id="meteoconsThermometerSunFill7">
          <path
            fill="none"
            d="M256 392c31 0 56-25.4 56-56.8a57 57 0 0 0-24-46.6V152.5a32.2 32.2 0 0 0-32-32.5V79.7h167.2V392Zm4-192h28m-28-32h28m-28 64h28"
          />
        </clipPath>
      </defs>
      <g clipPath="url(#meteoconsThermometerSunFill7)">
        <use
          width="196"
          height="196"
          href="#meteoconsThermometerSunFill0"
          transform="translate(216 108)"
        />
      </g>
      <use
        width="118"
        height="278"
        href="#meteoconsThermometerSunFill3"
        transform="translate(197 117)"
      />
    </svg>
  );
}
