import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export const InfoField = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode

}) => {

    return (
        <div className="flex  items-center p-1 space-x-1.5">
            <span className="text-xs font-medium border-b-2 border-primary/60">
                {label}
            </span>
            <span>:</span>
            <Badge
                variant={"secondary"}
                className="text-xs text-right text-secondary-foreground truncate pr-2"
            >
                {value}
            </Badge>

        </div>
    );
};

export const Section = ({
    title,
    children,
    className = "",
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={`bg-background border border-secondary-foreground-200 `}
    >
        <div className="px-3 py-2 border-b rounded-t-lg">
            <h3 className="text-sm font-semibold tracking-wide text-accent-foreground">
                {title}
            </h3>
        </div>
        <div className={cn("p-3 space-y-1",className )}>{children}</div>
    </div>
);

export const AddressInfo = ({ label, value }: { label: string; value: React.ReactNode }) => {
    return (
        <div className="py-2 space-y-2.5">
            <p className="text-xs border-b-2 border-primary/60 font-medium flex-shrink-0">
                {label}
            </p>
            <p className="text-xs font-base text-secondary-foreground  pr-2">
                {value}
            </p>
        </div>
    );
};
