import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;

export default async function handler(request) {
  const auraRingImageData = await fetch(
    new URL('/static/images/icons/bigAuraRing.png', APP_DOMAIN)
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
    const liveName =
      searchParams.has('liveName') && searchParams.get('liveName');
    const coachProfileImage =
      searchParams.has('coachProfileImage') &&
      searchParams.get('coachProfileImage');
    const liveTime =
      searchParams.has('liveTime') && searchParams.get('liveTime');
    const coachProfessionalTitle =
      searchParams.has('coachProfessionalTitle') &&
      searchParams.get('coachProfessionalTitle');
    const backgroundColor =
      searchParams.has('backgroundColor') &&
      searchParams.get('backgroundColor');
    const landScapeImage =
      searchParams.has('landScapeImage') && searchParams.get('landScapeImage');

    return new ImageResponse(
      <div
        style={{
          backgroundImage: backgroundColor,
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          position: 'relative',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          padding: landScapeImage ? '45px 30px 20px' : '80px 45px 55px',
          color: '#fff',
          justifyContent: 'space-between',
        }}>
        <img
          alt=""
          height={540}
          width={540}
          src={coachProfileImage}
          style={{
            position: 'absolute',
            bottom: 0,
            aspectRatio: 'auto',
            right: landScapeImage ? 0 : 45,
          }}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            alignItems: landScapeImage ? 'flex-start' : 'center',
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
              alignItems: 'center',
              background: '#fff',
              borderRadius: '8px',
              fontFamily: 'Proxima',
              display: 'flex',
              height: landScapeImage ? '46px' : '52px',
              justifyContent: 'center',
              width: landScapeImage ? '80px' : '90px',
              marginBottom: landScapeImage ? '20px' : '40px',
            }}>
            <div
              style={{
                fontSize: landScapeImage ? '30px' : '36px',
                background:
                  'linear-gradient(277.58deg, #ff3acd 5.87%, #ff3a46 94.13%)',
                backgroundClip: 'text',
                fontWeight: 600,
                fontFamily: 'Proxima-bold',
                color: 'transparent',
              }}>
              Live
            </div>
          </div>
          <div
            style={{
              fontSize: landScapeImage ? 52 : 58,
              fontFamily: 'Proxima-bold',
              lineHeight: landScapeImage ? '52px' : '58px',
              fontWeight: 600,
              textAlign: 'center',
            }}>
            {liveName}
          </div>

          {liveTime && (
            <div
              style={{
                fontSize: landScapeImage ? 28 : 32,
                fontFamily: 'Proxima',
                marginTop: landScapeImage ? '10px' : '14px',
              }}>
              {liveTime}
            </div>
          )}
          <div
            style={{
              marginTop: landScapeImage ? 30 : 40,
              fontSize: 42,
              fontFamily: 'Proxima-bold',
              fontWeight: 600,
              lineHeight: '42px',
            }}>
            {coachName}
          </div>
          <div
            style={{
              marginTop: landScapeImage ? 15 : 20,
              fontSize: landScapeImage ? 32 : 36,
              fontFamily: 'Proxima',
              opacity: '0.7',
              lineHeight: '36px',
            }}>
            {coachProfessionalTitle}
          </div>
        </div>
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
