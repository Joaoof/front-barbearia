import { Card, CardContent } from "@/components/ui/card"
import type { Schedule } from "@/lib/api"

interface ScheduleSectionProps {
  schedule: Schedule
}

export function ScheduleSection({ schedule }: ScheduleSectionProps) {
  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-medium">Horários</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${schedule.isOpen ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className={`text-sm ${schedule.isOpen ? "text-green-500" : "text-red-500"}`}>
            {schedule.isOpen ? "Aberto" : "Fechado"}
          </span>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-300 text-sm">Segunda à Sexta</p>
              <p className="text-white text-sm">
                {schedule.weekdays.open} às {schedule.weekdays.close}
              </p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Sábado</p>
              <p className="text-white text-sm">
                {schedule.saturday.open} às {schedule.saturday.close}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
