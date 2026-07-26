import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;

export default async function handler(request) {
  const auraRingImageData = await fetch(
    new URL('/static/images/icons/bigAuraRing.png', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());
  const waveImageData = await fetch(
    new URL('/static/images/waves.png', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());
  const fontData = await fetch(
    new URL('/static/fonts/ProximaNova-Regular.otf', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());
  const fontDataBold = await fetch(
    new URL('/static/fonts/ProximaNova-Bold.otf', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());

  try {
    const { searchParams } = new URL(request.url);
    const coachName =
      searchParams.has('coachName') && searchParams.get('coachName');
    const coachProfileImage =
      searchParams.has('coachProfileImage') &&
      searchParams.get('coachProfileImage');
    const coachProfessionalTitle =
      searchParams.has('coachProfessionalTitle') &&
      searchParams.get('coachProfessionalTitle');
    const title = searchParams.has('title') && searchParams.get('title');
    const trackImage =
      searchParams.has('trackImage') && searchParams.get('trackImage');
    const duration =
      searchParams.has('duration') && searchParams.get('duration');
    const type = searchParams.has('type') && searchParams.get('type');
    const landScapeImage =
      searchParams.has('landScapeImage') && searchParams.get('landScapeImage');

    return new ImageResponse(
      <div
        style={{
          backgroundImage: `url(${trackImage})`,
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          position: 'relative',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          color: '#fff',
          justifyContent: 'space-between',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(150px)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: landScapeImage ? 1200 : 630,
            height: landScapeImage ? 630 : 1200,
          }}></div>

        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            alignItems: landScapeImage ? 'flex-start' : 'center',
            justifyContent: 'space-between',
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: landScapeImage ? 'flex-start' : 'center',
            }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: landScapeImage ? 'flex-start' : 'center',
                padding: landScapeImage ? '30px 30px 0' : '80px 45px 0',
              }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: landScapeImage ? '10px' : '40px',
                  flexDirection: landScapeImage ? 'row' : 'column',
                  gap: '5px',
                }}>
                <img width="64" height="64" src={auraRingImageData} alt="" />
                <div
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'Proxima',
                    fontSize: 28,
                    letterSpacing: '3.5px',
                  }}>
                  AURA
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: landScapeImage ? 28 : 32,
                  lineHeight: '100%',
                  fontFamily: 'Proxima',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.70)',
                  marginTop: landScapeImage ? 10 : 30,
                  alignItems: 'center',
                  gap: 10,
                }}>
                <div>{type}</div>
                <div
                  style={{
                    height: 8,
                    width: 8,
                    background: 'white',
                    borderRadius: '50%',
                    marginTop: 8,
                  }}></div>
                <div>{`${duration} Min`}</div>
              </div>
              <div
                style={{
                  fontSize: landScapeImage ? 48 : 52,
                  fontFamily: 'Proxima-bold',
                  lineHeight: '100%',
                  fontWeight: 600,
                  textAlign: 'center',
                  marginTop: 10,
                }}>
                {title}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: landScapeImage ? 'flex-start' : 'center',
                width: '100%',
                marginTop: landScapeImage ? 50 : 70,
                position: 'relative',
                alignItems: !landScapeImage ? 'center' : 'flex-start',
                // paddingLeft: landScapeImage && '30px',
              }}>
              <img
                src={waveImageData}
                alt=""
                style={{ position: 'absolute' }}
              />
              <img
                width={landScapeImage ? 300 : 300}
                height={landScapeImage ? 200 : 300}
                src={trackImage}
                alt=""
                style={{
                  borderRadius: 10,
                  // zIndex: '0',
                  marginLeft: landScapeImage && 30,
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: landScapeImage
                ? '30px 280px 30px 30px'
                : '40px 30px 30px 280px',
              borderTop: '1px solid rgba(255,255,255, 0.1)',
              justifyContent: 'center',
            }}>
            <div
              style={{
                fontSize: 36,
                fontFamily: 'Proxima-bold',
                fontWeight: 600,
                lineHeight: '100%',
                textAlign: 'left',
              }}>
              {coachName}
            </div>
            <div
              style={{
                marginTop: 5,
                fontSize: landScapeImage ? 28 : 32,
                fontFamily: 'Proxima',
                opacity: '0.7',
                textAlign: 'left',
              }}>
              {coachProfessionalTitle}
            </div>
          </div>
        </div>
        <img
          alt=""
          height={landScapeImage ? 360 : 260}
          width={landScapeImage ? 360 : 260}
          src={coachProfileImage}
          style={{
            position: 'absolute',
            bottom: 0,
            aspectRatio: 'auto',
            [landScapeImage ? 'right' : 'left']: 0,
            zIndex: 1000,
          }}
        />
      </div>,
      {
        width: landScapeImage ? 1200 : 630,
        height: landScapeImage ? 630 : 1200,
        fonts: [
          {
            name: 'Proxima',
            data: fontData,
            style: 'normal',
          },
          {
            name: 'Proxima-bold',
            data: fontDataBold,
            style: 'bold',
          },
        ],
      }
    );
  } catch (e) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
