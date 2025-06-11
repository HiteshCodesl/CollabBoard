import { ReactNode } from "react"

export function Icons({
     activated,
     onClick,
     icon,
} : {
     icon: ReactNode,
     onClick: () => void,
     activated: boolean
}) {
  return (
    <div  className={`pointer flex  gap-2 ${activated ? " p-4 bg-[#a5abfc] rounded-xl" :"text-white"}`} onClick={onClick}>
      {icon}
    </div>
  )
}