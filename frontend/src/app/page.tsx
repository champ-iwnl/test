import { Container } from '@/components/layout/Container'
import { NicknameForm } from '@/features/auth/components/NicknameForm'
import { Button } from '@/components/ui/Button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Container className="relative h-[calc(100vh-2rem)] min-h-[600px] rounded-3xl p-6 pt-10 flex flex-col">
        
        {/* Content Section (Positioned) */}
        <div className="w-full">
          {/* Header Title */}
          <div 
            className="absolute" 
            style={{ top: '276px', left: '15px' }}
          >
            <h1 className="text-[32px] font-medium text-black" style={{ lineHeight: '100%', letterSpacing: '0px' }}>
              Nextzy Test (Full Stack)
            </h1>
          </div>

          {/* Subtitle (เกมสะสมคะแนน) - responsive */}
          <div
            className="absolute flex items-center justify-center text-center md:static md:mx-auto"
            style={{
              top: '320px',
              left: '15px',
              width: '90px',
              height: '17px',
              backgroundColor: '#979797',
              fontFamily: 'Kanit',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '120%',
              letterSpacing: '0%',
              color: 'white',
              borderRadius: '8px',
              opacity: 1,
            }}
          >
            เกมสะสมคะแนน
          </div>

          <div
            className="w-full"
            style={{ paddingTop: '382px', paddingLeft: '16px' }}
          >
            <div
              className="w-full"
              style={{ maxWidth: '345px', minWidth: '345px' }}
            >
              {/* Form Section */}
              <NicknameForm
                className="w-full mt-2"
                inputContainerClassName="mt-2"
                buttonContainerClassName="mb-4"
                hideButton
              />
            </div>
          </div>
        </div>

        {/* Bottom sticky bar matching Figma */}
        <div className="absolute left-0 right-0 bottom-0 px-4 pb-6 pt-4 bg-white rounded-b-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <div className="mx-auto w-full max-w-[343px]">
            <Button form="nickname-form" type="submit" size="md" className="w-full rounded-full">
              เข้าเล่น
            </Button>
          </div>
        </div>

      </Container>
    </div>
  )
}