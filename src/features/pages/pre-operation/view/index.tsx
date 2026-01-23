import { useQueryState } from "nuqs";
import { usePreopIds } from "../preop.queries";
import LoadingPage from "@/components/loadingpage";
import Image from "next/image"
import { InfoField, Section } from "@/components/review-componemts";
import { PreOpWithPath } from "../preop.repository";
import { handleDownload, htmlContentStyles } from "../columns";
import { Badge } from "@/components/ui/badge";
import { dateUtils } from "@/lib/utils/date";
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSharedState } from "@/components/providers/dashboard-context";
const Pre_operationviewModule = () => {
  const [ids] = useQueryState('id')
const { value } = useSharedState()
    ;

  const { data } = usePreopIds({ id: ids || '', auth: value.password as string });
  if (!data) return <LoadingPage />
  return <div>
    {data?.map((patient, i) => <div className="flex relative" key={i}> <div className=" absolute -left-4 sm:left-0"><Badge className="text-base sm:mt-6 font-bold">{i + 1}</Badge></div> < PreopView data={patient} /></div>)}
    {/* {ids} */}

    <div className="pt-20">
      <p></p>
    </div>
  </div>
};

export default Pre_operationviewModule;


export const PreopView = ({ data }: { data: PreOpWithPath }) => <div className="grid gap-4 max-w-full overflow-x-clip">
  {/* Diagnosis Section */}
  <Section title="Diagnosis">
    <article
      className={htmlContentStyles}
      dangerouslySetInnerHTML={{ __html: data.diagnosis }}
    />
  </Section>

  {/* Vital Signs */}
  <Section title="Vital Signs" className="flex flex-wrap gap-2.5">
    {data.vitalSigns.map((sign, id) => (
      <Badge
        variant="outline"
        key={id}
        className="text-xs text-secondary-foreground"
      >
        {sign.name}
      </Badge>
    ))}
  </Section>

  {/* General Information */}
  <Section title="General Information" className="grid sm:grid-cols-2 gap-2.5">
    <InfoField label="BSA" value={data.bsa} />
    <InfoField label="Priority" value={data.riskPriority} />
    <InfoField label="Hospital" value={data.hospital} />
    <InfoField label="SATS" value={data.sats} />
    <InfoField label="To Do" value={data.todo} />
    <InfoField label="Created By" value={data.staffId} />
  </Section>

  {/* Dental History */}
  <Section title="Dental History">
    <article
      className={htmlContentStyles}
      dangerouslySetInnerHTML={{ __html: data.dentalHistory }}
    />
  </Section>

  {/* Personal Information */}
  <Section title="Personal Information" className="grid sm:grid-cols-2 gap-2.5">
    <InfoField
      label="Full Name"
      value={`${data?.patient?.firstName} ${data?.patient?.middleName || ''} ${data?.patient?.lastName}`.trim()}
    />
    <InfoField label="Email" value={data?.patient?.email} />
    <InfoField label="Phone Number" value={data?.patient?.phoneNumber} />
    <InfoField label="Gender" value={data?.patient?.gender} />
    <InfoField
      label="Date of Birth"
      value={dateUtils.formatFull(data?.patient?.dateOfBirth)}
    />
  </Section>

  {/* Supporting Documents */}
  <Section title="Supporting Documents" className="grid sm:grid-cols-2 gap-4">
    {data.supportingDocuments.map((doc, index) => (
      <div
        key={index}
        className="border p-3 rounded bg-muted/30 flex flex-col"
      >
        <div className="flex-1 mb-1.5">
          <p className="font-medium text-sm mb-1">
            {doc.name || `Document ${index + 1}`}
          </p>
          <Badge variant="outline" className="text-xs">
            {doc.size}
          </Badge>
        </div>

        {doc.type.startsWith('image') && (
          <div className="my-2">
            <Image
              src={`/api/image?url=${encodeURIComponent(doc.ufsUrl)}`}
              alt={doc.name || `Document ${index + 1}`}
              width={300}
              height={200}
              className="rounded"
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <Button
            size="sm"
            variant="link"
            className="text-xs"
            onClick={() => handleDownload(doc.ufsUrl, doc.name || `document-${index + 1}`)}
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          <a
            href={doc.ufsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), 'text-xs')}
          >
            View Document
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    ))}
  </Section>
</div>
