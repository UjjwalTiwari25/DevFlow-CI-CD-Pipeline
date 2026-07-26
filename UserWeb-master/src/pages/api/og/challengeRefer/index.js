import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;

export default async function handler(request) {
  const backgroundImageData = await fetch(
    new URL('/static/images/referNew/new-reffer-lp-hero-mob.png', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());
  const bestOfAppleImageData = await fetch(
    new URL('/static/images/bestOfApple.png', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());
  const auraRingImageData = await fetch(
    new URL('/static/images/icons/bigAuraRing.png', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());
  const fontData = await fetch(
    new URL('/static/fonts/ProximaNova-Regular.otf', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());
  const fontDataBold = await fetch(
    new URL('/static/fonts/ProximaNova-Bold.otf', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());
  const challengeIconData = await fetch(
    new URL('/static/images/icons/challengeIcon.png', APP_DOMAIN)
  ).then((res) => res.arrayBuffer());

  try {
    const { searchParams } = new URL(request.url);

    const referrerName =
      searchParams.has('referrerName') && searchParams.get('referrerName');
    const challengeName =
      searchParams.has('challengeName') && searchParams.get('challengeName');
    const duration =
      searchParams.has('duration') && searchParams.get('duration');
    const cardImage =
      searchParams.has('cardImage') && searchParams.get('cardImage');
    const startDate =
      searchParams.has('startDate') && searchParams.get('startDate');
    const landScapeImage =
      searchParams.has('landScapeImage') && searchParams.get('landScapeImage');

    return new ImageResponse(
      <div
        style={{
          backgroundColor: '#FFFFFF',
          // backgroundSize: '150px 150px',
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          position: 'relative',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          maxWidth: '584px',
        }}>
        <img
          width="100%"
          height="630px"
          src={backgroundImageData}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            objectFit: 'cover',
          }}
        />

        <div
          style={{
            padding: '50px 38px 65px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <img
            width="200"
            height="54"
            src={bestOfAppleImageData}
            alt=""
            style={{
              opacity: 0.8,
              marginBottom: 23,
            }}
          />
          <div
            style={{
              color: '#28292B',
              textAlign: 'center',
              fontFamily: '"Proxima-bold',
              fontSize: 48,
              fontWeight: 700,
              lineHeight: '110%',
              marginBottom: 59,
              width: '100%',
            }}>
            {`${referrerName} sent you an invite`}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '44px',
              gap: '16px',
            }}>
            <img width="110" height="110" src={auraRingImageData} alt="" />
            <div
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: '"Proxima',
                fontSize: 30,
                letterSpacing: '3.5px',
              }}>
              AURA
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url(${cardImage})`,
              height: 360,
              width: '100%',
              // backgroundPosition: 'center',
              backgroundSize: '100% 100%',
              borderRadius: '28px',
              padding: '26px 34px 15px',
              display: 'flex',
              marginBottom: '42px',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              <img
                width="62"
                height="62"
                src={challengeIconData}
                alt=""
                style={{ marginBottom: '15px' }}
              />
              <div
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontFamily: '"Proxima-bold',
                  fontSize: 38,
                  lineHeight: '120%',
                  marginBottom: '6px',
                }}>
                {challengeName}
              </div>
              <div
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontFamily: '"Proxima',
                  fontSize: 26,
                  lineHeight: '135%',
                  marginBottom: '16px',
                  letterSpacing: '0.25px',
                }}>{`${duration} day Challenge`}</div>
            </div>
            <div
              style={{
                height: '76px',
                width: '440px',
                borderRadius: '152px',
                background:
                  'linear-gradient(0deg, #FFF 0%, #FFF 100%), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                boxShadow: '0px 18.45px 61.5px 0px rgba(43, 42, 107, 0.20)',
                color: '#000',
                textAlign: 'center',
                fontFamily: '"Proxima-bold',
                fontSize: '33px',
                fontWeight: 500,
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              Join Challenge
            </div>
          </div>
          {startDate && (
            <div
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: '"Proxima',
                fontSize: 32,
                fontWeight: 400,
                lineHeight: '120%',
                marginBottom: 23,
              }}>
              {`Challenge Starts ${startDate}`}
            </div>
          )}

          <div
            style={{
              color: '#000',
              textAlign: 'center',
              fontFamily: '"Proxima',
              fontSize: 32,
              fontWeight: 400,
              lineHeight: '120%',
              marginTop: !startDate && 34,
            }}>
            {`Join challenge now and redeem your free 30-day Guest Pass from ${referrerName}`}
          </div>
        </div>
      </div>,
      {
        width: landScapeImage ? 1024 : 584,
        height: landScapeImage ? 584 : 1024,
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
