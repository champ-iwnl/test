import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { formatPoints } from '@/utils/formatters'

interface ResultModalProps {
  isOpen: boolean
  points: number | null
  onClose: () => void
}

export function ResultModal({ isOpen, points, onClose }: ResultModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-800 mb-2">ได้รับ</div>
        <div className="text-gray-500 mb-6">{points ? `${formatPoints(points)} คะแนน` : '-'}</div>
        <Button size="sm" onClick={onClose} className="px-8" style={{ borderRadius: 0 }}>
          ปิด
        </Button>
      </div>
    </Modal>
  )
}
