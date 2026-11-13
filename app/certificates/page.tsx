import type { Metadata } from "next";
import { CertificateGallery } from "@/components/CertificateGallery";
import { PageHeader } from "@/components/PageHeader";
import { certificates } from "@/content/site";

export const metadata: Metadata = { title: "Certificates" };

export default function CertificatesPage() {
  return (
    <>
      <PageHeader
        title="Certificates"
        intro="Courses I've completed outside my regular classes. Open one to see it up close, or download the original PDF."
      />
      <div className="container-site mt-14">
        <CertificateGallery certificates={certificates} />
      </div>
    </>
  );
}
