import { Badge } from "../ui/badge";

export const InfoField = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode

}) => {

    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-xs font-medium border-b-2 border-primary/60">
                {label}
            </span>

            <Badge
                variant={"outline"}
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
        className={`bg-background border border-secondary-foreground-200 ${className}`}
    >
        <div className="px-3 py-2 border-b rounded-t-lg">
            <h3 className="text-sm font-semibold tracking-wide text-accent-foreground">
                {title}
            </h3>
        </div>
        <div className="p-3 space-y-1">{children}</div>
    </div>
);

export const AddressInfo = ({ label, value }: { label: string; value: React.ReactNode }) => {
    return (
        <div className="py-2 space-y-2.5">
            <p className="text-xs border-b-2 border-primary/60 font-medium flex-shrink-0">
                {label}
            </p>
            <p className="text-xs font-base text-secondary-foreground truncate pr-2">
                {value}
            </p>
        </div>
    );
};
