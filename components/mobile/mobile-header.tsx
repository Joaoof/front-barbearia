import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MobileHeaderProps {
  userName: string
  userAvatar?: string
  currentDate: string
  showStatusBar?: boolean
}

export function MobileHeader({ userName, userAvatar, currentDate, showStatusBar = true }: MobileHeaderProps) {
  return (
    <>
      {/* Header com espaçamento ajustado */}
      <div className="pt-6 pb-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/images/jardel-profile.jpg" alt={userName} />
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-white">Olá, {userName} 👋</h1>
              <p className="text-gray-400 text-sm">{currentDate}</p>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  )
}
