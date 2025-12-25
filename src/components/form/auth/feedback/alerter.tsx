import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

export const Alerter = ({ title, message, variant }: { title: string, message?: string, variant?: "default" | "destructive" | null | undefined }) => {
    return <Alert variant={variant} className="mt-3">
        <AlertCircleIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
            {message}
        </AlertDescription>
    </Alert>

}