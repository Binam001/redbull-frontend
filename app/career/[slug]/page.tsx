import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CAREER_JOBS } from "@/constants/careers";
import CareerHero from "@/components/career/CareerHero";
import CareerDetail from "@/components/career/CareerDetail";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return CAREER_JOBS.map((job) => ({
        slug: job.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const job = CAREER_JOBS.find((item) => item.slug === slug);

    if (!job) {
        return {
            title: "Career Not Found | Red Bull",
        };
    }

    return {
        title: `${job.title} | Careers - Red Bull`,
        description: job.description,
    };
}

export default async function CareerDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const job = CAREER_JOBS.find((item) => item.slug === slug);

    if (!job) {
        notFound();
    }

    return (
        <main className="relative bg-black min-h-screen">
            {/* Hero Header with Grayscale Background & Job Title */}
            <CareerHero title={job.title} />

            {/* Application Form & Job Details Sidebar */}
            <CareerDetail job={job} />
        </main>
    );
}
