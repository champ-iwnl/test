import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

interface ClaimSuccessModalProps {
  isOpen: boolean
  rewardName?: string
  onClose: () => void
}

export function ClaimSuccessModal({ isOpen, rewardName = '', onClose }: ClaimSuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          padding: '40px 16px',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Medal/Coin Icon */}
        <Image
          src="/images/spin-coin.svg"
          alt="reward-coin"
          width={80}
          height={80}
        />

        {/* Congratulation Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1F2937',
              fontFamily: 'Kanit',
              lineHeight: '1.2',
            }}
          >
            ยินดีด้วย
          </div>
          {rewardName && (
            <div
              style={{
                fontSize: '14px',
                color: '#6B7280',
                fontFamily: 'Kanit',
                lineHeight: '1.2',
              }}
            >
              คุณ{rewardName}
            </div>
          )}
        </div>

        {/* OK Button */}
        <Button size="sm" onClick={onClose} className="w-full">
          ตกลง
        </Button>
      </div>
    </Modal>
  )
}
