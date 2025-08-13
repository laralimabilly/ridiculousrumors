// app/api/og-image/[id]/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { theoryService } from '@/lib/theoryService';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const theoryId = params.id;
    
    // Fetch theory data
    let theory;
    try {
      theory = await theoryService.getTheoryById(theoryId);
    } catch (error) {
      console.error('Error fetching theory for OG image:', error);
      return new Response('Theory not found', { status: 404 });
    }

    if (!theory) {
      return new Response('Theory not found', { status: 404 });
    }

    // Truncate theory content for image
    const displayText = theory.content.length > 180
      ? `${theory.content.substring(0, 180)}...`
      : theory.content;

    // Format category for display
    const categoryDisplay = theory.category.replace('-', ' ').toUpperCase();

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            backgroundImage: `
              radial-gradient(circle at 25px 25px, #22c55e 2px, transparent 0),
              radial-gradient(circle at 75px 75px, #22c55e 2px, transparent 0)
            `,
            backgroundSize: '100px 100px',
            backgroundOpacity: '0.1',
            fontFamily: 'monospace',
            color: '#22c55e',
            position: 'relative',
          }}
        >
          {/* Top classification banner */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: '#991b1b',
              color: '#fca5a5',
              textAlign: 'center',
              padding: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              borderBottom: '2px solid #ef4444',
            }}
          >
            TOP SECRET FICTIONAL CONTENT - RIDICULOUS RUMORS
          </div>

          {/* Main content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 40px 40px 40px',
              textAlign: 'center',
              height: '100%',
              maxWidth: '1000px',
            }}
          >
            {/* Logo/Title */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '30px',
                color: '#22c55e',
                letterSpacing: '3px',
                textShadow: '0 0 20px #22c55e',
              }}
            >
              RIDICULOUS RUMORS
            </div>

            {/* Category badge */}
            <div
              style={{
                backgroundColor: '#1f2937',
                border: '2px solid #22c55e',
                padding: '8px 16px',
                marginBottom: '30px',
                fontSize: '18px',
                color: '#22c55e',
                letterSpacing: '1px',
              }}
            >
              CATEGORY: {categoryDisplay}
            </div>

            {/* Theory content */}
            <div
              style={{
                fontSize: '24px',
                lineHeight: '1.4',
                color: '#dcfce7',
                marginBottom: '30px',
                fontStyle: 'italic',
                maxWidth: '900px',
                textAlign: 'center',
              }}
            >
              "{displayText}"
            </div>

            {/* Warning disclaimer */}
            <div
              style={{
                backgroundColor: '#854d0e',
                border: '2px solid #eab308',
                color: '#fde047',
                padding: '15px',
                fontSize: '16px',
                textAlign: 'center',
                maxWidth: '800px',
                marginTop: 'auto',
              }}
            >
              ⚠️ FICTIONAL CONTENT FOR ENTERTAINMENT ONLY ⚠️
            </div>
          </div>

          {/* Corner decorations */}
          <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '20px',
              fontSize: '20px',
              color: '#22c55e',
              opacity: 0.3,
            }}
          >
            ╔
          </div>
          <div
            style={{
              position: 'absolute',
              top: '80px',
              right: '20px',
              fontSize: '20px',
              color: '#22c55e',
              opacity: 0.3,
            }}
          >
            ╗
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              fontSize: '20px',
              color: '#22c55e',
              opacity: 0.3,
            }}
          >
            ╚
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              fontSize: '20px',
              color: '#22c55e',
              opacity: 0.3,
            }}
          >
            ╝
          </div>

          {/* Website URL */}
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              right: '40px',
              fontSize: '14px',
              color: '#22c55e',
              opacity: 0.7,
            }}
          >
            ridiculousrumors.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}