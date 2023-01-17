import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'experimental-edge',
}

export default function handler() {
  try {
    return new ImageResponse(
      (
        <div tw='bg-white w-full h-full flex items-center justify-center'>
          <div tw='flex items-center justify-center'>
            <svg width='170' height='170' viewBox='8 7 50 50' fill='#057AFF' xmlns='http://www.w3.org/2000/svg'>
              <g transform='rotate(90, 30,30) translate(-7)'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M77.4802 0.458374H66.3071L48.6481 17.9349C43.3188 23.2091 34.6786 23.2091 29.3494 17.9349L11.6904 0.458374H0.517442L23.7629 23.4637C32.1775 31.7913 45.82 31.7913 54.2348 23.4637L77.4802 0.458374ZM0.375 64.431H11.548L29.3505 46.8123C34.6798 41.5381 43.32 41.5381 48.6492 46.8123L66.4519 64.431H77.625L54.2359 41.2836C45.8212 32.956 32.1786 32.956 23.764 41.2836L0.375 64.431Z'
                  transform='rotate(91.5 39 32.5) scale(0.4,1) translate(19.5,23.35)'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M77.4802 0.458374H66.3071L48.6481 17.9349C43.3188 23.2091 34.6786 23.2091 29.3494 17.9349L11.6904 0.458374H0.517442L23.7629 23.4637C32.1775 31.7913 45.82 31.7913 54.2348 23.4637L77.4802 0.458374ZM0.375 64.431H11.548L29.3505 46.8123C34.6798 41.5381 43.32 41.5381 48.6492 46.8123L66.4519 64.431H77.625L54.2359 41.2836C45.8212 32.956 32.1786 32.956 23.764 41.2836L0.375 64.431Z'
                  transform='rotate(91.5 39 32.5) scale(0.4,1) translate(68,-23.35)'
                />
              </g>
            </svg>
          </div>
          <div tw='text-8xl ml-8 py-32'>XRPSwap</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
